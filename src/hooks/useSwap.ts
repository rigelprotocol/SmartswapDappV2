import { Currency } from '@uniswap/sdk-core';
import { useEffect } from 'react';
import { useActiveWeb3React } from '../utils/hooks/useActiveWeb3React';
import { useState } from 'react';
import { smartFactory, SmartSwapRouter } from '../utils/Contracts';
import {
  RGPADDRESSES,
  SMARTSWAPFACTORYADDRESSES,
  SMARTSWAPROUTER,
  WNATIVEADDRESSES,
} from '../utils/addresses';
import { ZERO_ADDRESS } from '../constants';
import { ethers } from 'ethers';
import { getAddress } from '../utils/hooks/usePools';

const formatAmount = (number: string) => {
  // const numb = ethers.BigNumber.from(number).toString();
  // let res = ethers.utils.formatEther(num);
  // res = (+res).toString();
  // return res;
  const num = ethers.utils.formatEther(number);
  return num;
};

export const useSwap = (
  currencyA: Currency,
  currencyB: Currency,
  amountIn?: string
) => {
  const { chainId } = useActiveWeb3React();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>('');
  const [wrap, setWrap] = useState<boolean>(false);

  let nativeAddress;

  if (!currencyA || !currencyB) {
    nativeAddress = undefined;
  }

  if (currencyA?.isNative || currencyB?.isNative) {
    nativeAddress = { address: WNATIVEADDRESSES[chainId as number] };
  }

  const [tokenA, tokenB] = chainId
    ? [currencyA?.wrapped, currencyB?.wrapped]
    : [undefined, undefined];
  const tokenOneAddress = tokenA?.address || nativeAddress?.address;
  const tokenTwoAddress = tokenB?.address || nativeAddress?.address;
  const wrappable: boolean = tokenOneAddress == tokenTwoAddress;
  console.log(wrappable);
  let validSmartAddress: string;
  if (SMARTSWAPFACTORYADDRESSES[chainId as number] !== '0x') {
    validSmartAddress = SMARTSWAPFACTORYADDRESSES[chainId as number];
  }

  useEffect(() => {
    const getPairs = async () => {
      try {
        const SmartFactory = await smartFactory(validSmartAddress);
        const pairAddress = await SmartFactory.getPair(
          tokenOneAddress,
          tokenTwoAddress
        );
        setAddress(pairAddress);

        if (wrappable && address === ZERO_ADDRESS) {
          setWrap(true);
        }

        if (!wrappable && address !== ZERO_ADDRESS) {
          setWrap(false);
          if (amountIn !== undefined) {
            //setLoading(!loading);
            const SwapRouter = await SmartSwapRouter(
              SMARTSWAPROUTER[chainId as number]
            );
            const amountOut = await SwapRouter.getAmountsOut(amountIn, [
              tokenOneAddress,
              tokenTwoAddress,
            ]);

            const output = formatAmount(amountOut[1]);
            console.log(output);
            setAmount(output);
          } else {
            setAmount('');
          }
          // setLoading(false)
        } else if (!wrappable && address === ZERO_ADDRESS) {
          // RGP BNB BUSD USDT
          const CurrencyA = getAddress(currencyA);
          const CurrencyB = getAddress(currencyB);
          const factory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number]
          );

          const [RGPTOKENA, RGPTOKENB, NATIVETOKENA, NATIVETOKENB] =
            await Promise.all([
              factory.getPair(RGPADDRESSES[chainId as number], CurrencyA),
              factory.getPair(RGPADDRESSES[chainId as number], CurrencyB),
              factory.getPair(WNATIVEADDRESSES[chainId as number], CurrencyA),
              factory.getPair(WNATIVEADDRESSES[chainId as number], CurrencyB),
            ]);
        }
      } catch (e) {
        console.log(`Error occurs here: ${e}`);
        setAmount('');
      }
    };

    getPairs();
  }, [
    chainId,
    currencyA,
    currencyB,
    address,
    amountIn,
    wrap,
    tokenOneAddress,
    tokenTwoAddress,
  ]);

  return [address, wrap, amount];
};

//const formattedInput = ethers.utils.parseEther(amountIn);
