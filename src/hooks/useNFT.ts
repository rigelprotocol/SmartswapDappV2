import {useEffect, useMemo, useState} from "react";
import {RigelNFT, RigelNFTTwo} from "../utils/Contracts";
import {SMARTSWAPNFT, SMARTSWAPNFTTWO} from "../utils/addresses";
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {getERC20Token} from "../utils/utilsFunctions";
import {ethers} from "ethers";
import {formatAmount} from "../utils/hooks/useAccountHistory";
import {useSelector} from "react-redux";
import {RootState} from "../state";

export interface TokenProps {
    symbol: string,
    balance: string,
    address: string
}


export const useNFT = (array: number []) => {
    const { chainId, library, account } = useActiveWeb3React();
    const [nftData, setNftData] = useState('');
    const [firstToken, setFirstToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [secondToken, setSecondToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [prices, setPrices] = useState({firstTokenPrice: '', secondTokenPrice: ''});
    const [unsoldItems, setUnsoldItems] = useState<number[]>([]);

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

    useEffect( () => {
        const fetchNft = async () => {
            try {
                const nftContract = await RigelNFT(SMARTSWAPNFT[chainId as number], library);

                const purchaseData = await nftContract.nftPurchaseData(1);
                 console.log(purchaseData);
                setNftData(purchaseData);
                setPrices({firstTokenPrice: formatAmount(purchaseData.token1Price, 18),
                    secondTokenPrice: formatAmount(purchaseData.token2Price, 18)});

                const tokenOne = await getERC20Token(purchaseData.token1, library);
                const [tokenOneSymbol, tokenOneBalance] = await Promise.all(
                    [tokenOne.symbol(), tokenOne.balanceOf(account)]);
                setFirstToken({symbol: tokenOneSymbol,
                    balance: parseFloat(ethers.utils.formatEther(tokenOneBalance)).toFixed(4), address: purchaseData.token1});

                const tokenTwo = await getERC20Token(purchaseData.token2, library);
                const [tokenTwoSymbol, tokenTwoBalance] = await Promise.all(
                    [tokenTwo.symbol(), tokenTwo.balanceOf(account)]);
                setSecondToken({symbol: tokenTwoSymbol,
                    balance: parseFloat(ethers.utils.formatEther(tokenTwoBalance)).toFixed(4), address: purchaseData.token2});


                const allID = array;
                console.log(allID);
                let sold = [];
                let unsold = [];

                for (let i = allID[0]; i <= allID.length; i++) {
                    const views = await nftContract.sold(i);
                    views ? sold.push(i) : unsold.push(i)
                }

                setUnsoldItems(unsold);
                console.log(`Sold: ${sold}`);
                console.log(`Unsold: ${unsold}`);

                // const views = await nftContract.sold(23);
                // console.log(views);

            } catch (e) {
                console.log(e.message)
            }
        };
        fetchNft();
    }, [chainId, account, stateChanged]);

    return {firstToken, secondToken, prices, unsoldItems}
};




export const useNFTAllowance = (
    checkTokenApproval: number,
    token1Price: string,
    token2Price: string,
    currency: string,
    id: number
) => {
    const { account, chainId, library } = useActiveWeb3React();
    const [hasTokenABeenApproved, setHasTokenABeenApproved] = useState(false);
    const [hasTokenBBeenApproved, setHasTokenBBeenApproved] = useState(false);

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

    useEffect( () => {
        const getAllowance = async () => {
            if (account) {
                const nftContract = await RigelNFT(SMARTSWAPNFT[chainId as number], library);
                const nftToken = await nftContract.nftPurchaseData(id);

                if (nftToken.token1 && nftToken.token2) {
                    const [tokenA, tokenB] = await Promise.all([
                        getERC20Token(nftToken.token1 as string, library),
                        getERC20Token(nftToken.token2 as string, library),
                    ]);

                    const [allowanceA, allowanceB] = await Promise.all([
                        tokenA.allowance(account, SMARTSWAPNFT[chainId as number]),
                        tokenB.allowance(account, SMARTSWAPNFT[chainId as number]),
                    ]);

                    const isTokenAApproved = allowanceA.toString() > parseFloat(token1Price);
                    console.log(isTokenAApproved);
                    console.log(allowanceA.toString());
                    const isTokenBApproved = allowanceB.toString() > parseFloat(token2Price);


                    setHasTokenABeenApproved(isTokenAApproved);
                    setHasTokenBBeenApproved(isTokenBApproved);
                }
            }
        };
        getAllowance();
    }, [checkTokenApproval, currency, id, account]);

    return { hasTokenABeenApproved, hasTokenBBeenApproved };
};