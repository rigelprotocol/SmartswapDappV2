import {useEffect} from "react";
import {RigelNFT, RigelNFTTwo} from "../utils/Contracts";
import { SMARTSWAPNFTSALES, SMARTSWAPNFTTWO} from "../utils/addresses";
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {getERC20Token} from "../utils/utilsFunctions";
import {useSelector} from "react-redux";
import {RootState} from "../state";
import {formatAmount} from "../utils/hooks/useAccountHistory";
import {ethers} from "ethers";
import {getNftToken, getNftTokenPolygon} from "../state/nft/hooks";
import {SupportedChainId} from "../constants/chains";
import useState from "react-usestateref";

export interface TokenProps {
    symbol: string,
    balance: string,
    address: string
}

export const useNft = (id: number) => {
    const { chainId, library, account } = useActiveWeb3React();

    const [firstToken, setFirstToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [secondToken, setSecondToken] = useState<TokenProps>({symbol: '', balance: '', address: ''});
    const [prices, setPrices] = useState({firstTokenPrice: '', secondTokenPrice: ''});
    const [unsoldItems, setUnsoldItems] = useState<number>(0);
    const [nftId, setNftId, nftIdRef] = useState<number[]>([]);


    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged : boolean = trxState === 2;

    let validSmartAddress: string;
    if (SMARTSWAPNFTSALES[chainId as number] !== "0x") {
        validSmartAddress = SMARTSWAPNFTSALES[chainId as number];
    }


    useEffect(() => {

        if (chainId === SupportedChainId.POLYGONTEST) {
            const nftArray = getNftTokenPolygon(id);
            setNftId(nftArray);
        } else if (chainId === SupportedChainId.BINANCETEST) {
            const nftArray = getNftToken(id);
            setNftId(nftArray);
        }
        const fetchNftData = async () => {
            if (chainId !== undefined) {
                try {
                    const nftContract = await RigelNFT(validSmartAddress, library);

                    const purchaseData = await nftContract.nftPurchaseData(nftIdRef.current[0]);

                    const tokenOne = await getERC20Token(purchaseData.token1, library);
                    const [tokenOneSymbol, tokenOneBalance, tokenOneDecimals] = await Promise.all(
                        [tokenOne.symbol(), tokenOne.balanceOf(account), tokenOne.decimals()]);

                    setFirstToken({symbol: tokenOneSymbol,
                        balance: parseFloat(ethers.utils.formatEther(tokenOneBalance)).toFixed(4),
                        address: purchaseData.token1});

                    const tokenTwo = await getERC20Token(purchaseData.token2, library);
                    const [tokenTwoSymbol, tokenTwoBalance, tokenTwoDecimals] = await Promise.all(
                        [tokenTwo.symbol(), tokenTwo.balanceOf(account), tokenTwo.decimals()]);
                    setSecondToken({symbol: tokenTwoSymbol,
                        balance: parseFloat(ethers.utils.formatEther(tokenTwoBalance)).toFixed(4),
                        address: purchaseData.token2});

                    setPrices({firstTokenPrice: formatAmount(purchaseData.token1Price, tokenOneDecimals),
                        secondTokenPrice: formatAmount(purchaseData.token2Price, tokenTwoDecimals)});

                    const allID = nftIdRef.current;

                    for (let i = allID[0]; i <= allID.slice(-1)[0]; i++) {
                        const views = await nftContract.sold(i);
                        if (!views) {
                            setUnsoldItems(i);
                            break;
                        }
                    }
                } catch (e) {
                    console.log(e.message)
                }
            }
        };
        fetchNftData();
    }, [account, chainId, stateChanged]);

    return {firstToken, secondToken, prices, unsoldItems, nftId}
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
    const [loadInfo, setLoadInfo] = useState(false);

    useEffect( () => {
        const getAllowance = async () => {
            if (account) {
                try {
                    setLoadInfo(true);
                    const nftContract = await RigelNFT(SMARTSWAPNFTSALES[chainId as number], library);
                    const nftToken = await nftContract.nftPurchaseData(id);

                    if (nftToken.token1 && nftToken.token2) {
                        const [tokenA, tokenB] = await Promise.all([
                            getERC20Token(nftToken.token1 as string, library),
                            getERC20Token(nftToken.token2 as string, library),
                        ]);

                        const [allowanceA, allowanceB] = await Promise.all([
                            tokenA.allowance(account, SMARTSWAPNFTSALES[chainId as number]),
                            tokenB.allowance(account, SMARTSWAPNFTSALES[chainId as number]),
                        ]);

                        const isTokenAApproved = allowanceA.toString() > ethers.utils.parseEther(token1Price).toString();
                        const isTokenBApproved = allowanceB.toString() > ethers.utils.parseEther(token2Price).toString();

                        setHasTokenABeenApproved(isTokenAApproved);
                        setHasTokenBBeenApproved(isTokenBApproved);
                        setLoadInfo(false);
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        };
        getAllowance();
    }, [checkTokenApproval, currency, id, account]);

    return { hasTokenABeenApproved, hasTokenBBeenApproved, loadInfo };
};


export const useNftName =  (id: number) => {
    const { chainId, library, account } = useActiveWeb3React();
    const [name, setName] = useState('');
    const [nftImage, setNftImage] = useState('');
    const [loading, setLoading] = useState(false);

    let validSmartAddress: string;
    if (SMARTSWAPNFTTWO[chainId as number] !== "0x") {
        validSmartAddress = SMARTSWAPNFTTWO[chainId as number];
    }

    useEffect(() => {
        setLoading(true);
        const fetchDetails = async () => {
            if (id) {
                    try {
                        const nftContract = await RigelNFTTwo(validSmartAddress, library);

                        const nftDetails = await nftContract.uri(id);
                        const newArray = nftDetails.split('/');

                        let url;

                        if (chainId === SupportedChainId.BINANCETEST) {
                            url = `https://ipfs.io/ipfs/${newArray[2]}/${id}.json`;
                        } else {
                            url = `https://ipfs.io/ipfs/${newArray[2]}/RigelJson/${id}.json`;
                        }
                        const data = await fetch(url);
                        const jsonData = await data.json();

                        const nftName = jsonData.name;
                        setName(nftName);

                        const imageArr = jsonData.image.split('/');
                        let imageUrl;

                        if (chainId === SupportedChainId.BINANCETEST) {
                            imageUrl = `https://ipfs.io/ipfs/${imageArr[2]}/${id}.png`;
                        } else {
                            imageUrl = `https://ipfs.io/ipfs/${imageArr[2]}/Rigel/${id}.png`;
                        }
                        setNftImage(imageUrl);
                        setLoading(false);

                    } catch (e) {
                        console.log(e)
                    }
            }
        };
        fetchDetails();

    }, [id, account, chainId]);

    return {name, nftImage, loading}

};