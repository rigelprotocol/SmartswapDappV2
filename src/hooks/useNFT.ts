import {useEffect, useState} from "react";
import {RigelNFT} from "../utils/Contracts";
import {SMARTSWAPNFT} from "../utils/addresses";
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {getERC20Token} from "../utils/utilsFunctions";
import {useSelector} from "react-redux";
import {RootState} from "../state";

export interface TokenProps {
    symbol: string,
    balance: string,
    address: string
}

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