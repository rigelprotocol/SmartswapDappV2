import {Currency} from "@uniswap/sdk-core";
import {useEffect} from 'react';
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {useState} from "react";
import {smartFactory, SmartSwapRouter} from "../utils/Contracts";
import {SMARTSWAPFACTORYADDRESSES, SMARTSWAPROUTER} from "../utils/addresses";
import {ZERO_ADDRESS} from "../constants";
import {ethers} from "ethers";

const formatAmount = (number: string) => {
    const num = ethers.BigNumber.from(number).toString();
    let res = ethers.utils.formatEther(num);
    res = (+res).toFixed(6);
    return res;
};



export const useSwap = (currencyA: Currency, currencyB: Currency, amountIn?: string) => {
    const {chainId} = useActiveWeb3React();
    const [address, setAddress] = useState<string>();
    const [loadTrade, setLoadTrade] = useState(false);
    const [amount, setAmount] = useState<string | undefined>('');


    const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined];
    const tokenOneAddress = tokenA?.address;
    const tokenTwoAddress = tokenB?.address;
    let validSmartAddress: string;
    if (SMARTSWAPFACTORYADDRESSES[chainId as number] !== '0x') {
        validSmartAddress = SMARTSWAPFACTORYADDRESSES[chainId as number]
    }


    useEffect( () => {
        const getPairs = async () => {
            try {
                const SmartFactory = await smartFactory(validSmartAddress);
                const pairAddress = await SmartFactory.getPair(tokenOneAddress, tokenTwoAddress);
                setAddress(pairAddress);

                if (address && address !== ZERO_ADDRESS) {
                    if (amountIn !== undefined) {

                        setLoadTrade(true);
                        const SwapRouter = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
                        const amountOut = await SwapRouter.getAmountsOut(amountIn, [tokenOneAddress, tokenTwoAddress]);

                        const output = formatAmount(amountOut[1]);
                        console.log(output);
                        setAmount(output);
                        setLoadTrade(false)
                    } else {
                        setAmount('');
                        setLoadTrade(false)
                    }
                }

            } catch (e) {
                setAmount('')
            }

        };

        getPairs()
    }, [chainId, currencyA, currencyB, amountIn]);

    return [address, amount, loadTrade]
};


//const formattedInput = ethers.utils.parseEther(amountIn);


