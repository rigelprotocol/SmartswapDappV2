import {Currency} from '@uniswap/sdk-core';
import {useEffect, useState} from 'react';
import {useActiveWeb3React} from '../utils/hooks/useActiveWeb3React';
import {smartFactory, SmartSwapRouter} from '../utils/Contracts';
import {SMARTSWAPFACTORYADDRESSES, SMARTSWAPROUTER, WNATIVEADDRESSES,} from '../utils/addresses';
import {ZERO_ADDRESS} from '../constants';
import {ethers} from 'ethers';

const formatAmount = (number: string) => {
  return ethers.utils.formatEther(number);
};

export const useMint = (
  currencyA: Currency,
  currencyB: Currency,
  amountIn?: string
) => {
  const { chainId, library } = useActiveWeb3React();
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
  let validSmartAddress: string;
  if (SMARTSWAPFACTORYADDRESSES[chainId as number] !== '0x') {
    validSmartAddress = SMARTSWAPFACTORYADDRESSES[chainId as number];
  }

  useEffect(() => {
    const getPairs = async () => {
      try {
        const SmartFactory = await smartFactory(validSmartAddress, library);
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
              SMARTSWAPROUTER[chainId as number], library
            );
            const amountOut = await SwapRouter.getAmountsOut(amountIn, [
              tokenOneAddress,
              tokenTwoAddress,
            ]);

            const output = formatAmount(amountOut[1]);

            setAmount(output);
          } else {
            setAmount('');
          }
        }
      } catch (e) {
        console.log(e);
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
