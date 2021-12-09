import { Currency } from '@uniswap/sdk-core';
import { useEffect } from 'react';
import { useActiveWeb3React } from '../utils/hooks/useActiveWeb3React';
import { useState } from 'react';
import { smartFactory, SmartSwapRouter } from '../utils/Contracts';
import {
  BUSD,
  RGPADDRESSES,
  SMARTSWAPFACTORYADDRESSES,
  SMARTSWAPROUTER,
  USDT,
  WNATIVEADDRESSES,
} from '../utils/addresses';
import { ZERO_ADDRESS } from '../constants';
import { ethers } from 'ethers';
import { getAddress } from '../utils/hooks/usePools';
import { SupportedChainSymbols } from '../utils/constants/chains';

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
  const [pathArray, setPath] = useState<string[] | undefined>([]);
  const [pathSymbol, setPathSymbol] = useState('');

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
        const SmartFactory = await smartFactory(validSmartAddress);
        const pairAddress = await SmartFactory.getPair(
          tokenOneAddress,
          tokenTwoAddress
        );
        setAddress(pairAddress);

        if (wrappable) {
          setWrap(true);
        }

        if (!wrappable && address !== ZERO_ADDRESS) {
          setWrap(false);
          if (amountIn !== undefined) {
            const SwapRouter = await SmartSwapRouter(
              SMARTSWAPROUTER[chainId as number]
            );
            const amountOut = await SwapRouter.getAmountsOut(amountIn, [
              tokenOneAddress,
              tokenTwoAddress,
            ]);

            const output = formatAmount(amountOut[1]);
            
            setPath([tokenOneAddress as string, tokenTwoAddress as string]);
            setPathSymbol(`${currencyA.symbol} - ${currencyB.symbol}`);

            setAmount(output);
          } else {
            setAmount('');
          }
          // setLoading(false)
        } else if (!wrappable && address === ZERO_ADDRESS) {
          //   setWrap(true);
          setWrap(false);
          // RGP BNB BUSD USDT
          const CurrencyA = getAddress(currencyA);
          const CurrencyB = getAddress(currencyB);
          const factory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number]
          );
          const SwapRouter = await SmartSwapRouter(
            SMARTSWAPROUTER[chainId as number]
          );

          const [
            RGPTOKENA,
            RGPTOKENB,
            NATIVETOKENA,
            NATIVETOKENB,
            BUSDTOKENA,
            BUSDTOKENB,
            USDTTOKENA,
            USDTTOKENB,
          ] = await Promise.all([
            factory.getPair(RGPADDRESSES[chainId as number], CurrencyA),
            factory.getPair(RGPADDRESSES[chainId as number], CurrencyB),
            factory.getPair(WNATIVEADDRESSES[chainId as number], CurrencyA),
            factory.getPair(WNATIVEADDRESSES[chainId as number], CurrencyB),
            factory.getPair(BUSD[chainId as number], CurrencyA),
            factory.getPair(BUSD[chainId as number], CurrencyB),
            factory.getPair(USDT[chainId as number], CurrencyA),
            factory.getPair(USDT[chainId as number], CurrencyB),
          ]);

          const [USDTRGP, USDTNATIVE] = await Promise.all([
            factory.getPair(
              USDT[chainId as number],
              RGPADDRESSES[chainId as number]
            ),
            factory.getPair(
              USDT[chainId as number],
              WNATIVEADDRESSES[chainId as number]
            ),
          ]);

          try {
            if (USDTTOKENA !== ZERO_ADDRESS && USDTTOKENB !== ZERO_ADDRESS) {
              if (amountIn !== undefined) {
                const firstAmount = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  USDT[chainId as number],
                ]);
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [USDT[chainId as number], CurrencyB]
                );
                const output = formatAmount(secondAmount[1]);
                setPath([
                  CurrencyA as string,
                  USDT[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA.symbol} - USDT - ${currencyB.symbol}`
                );

                setAmount(output);
              } else {
                setAmount('');
                setPathSymbol('');
                setPath([]);
              }
            } else if (
              RGPTOKENA !== ZERO_ADDRESS &&
              RGPTOKENB !== ZERO_ADDRESS
            ) {
              if (amountIn !== undefined) {
                const firstAmount = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  RGPADDRESSES[chainId as number],
                ]);
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [RGPADDRESSES[chainId as number], CurrencyB]
                );
                const output = formatAmount(secondAmount[1]);
                setPath([
                  CurrencyA as string,
                  RGPADDRESSES[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA.symbol} - RGP - ${currencyB.symbol}`
                );

                setAmount(output);
              } else {
                setAmount('');
                setPathSymbol('');
                setPath([]);
              }
            } else if (
              NATIVETOKENA !== ZERO_ADDRESS &&
              NATIVETOKENB !== ZERO_ADDRESS
            ) {
              if (amountIn !== undefined) {
                const firstAmount = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  WNATIVEADDRESSES[chainId as number],
                ]);
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [WNATIVEADDRESSES[chainId as number], CurrencyB]
                );
                const output = formatAmount(secondAmount[1]);
                setPath([
                  CurrencyA as string,
                  WNATIVEADDRESSES[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA.symbol} - ${
                    SupportedChainSymbols[chainId as number]
                  } - ${currencyB.symbol}`
                );
                setAmount(output);
              } else {
                setAmount('');
                setPathSymbol('');
                setPath([]);
              }
            } else if (
              BUSDTOKENA !== ZERO_ADDRESS &&
              BUSDTOKENB !== ZERO_ADDRESS
            ) {
              if (amountIn !== undefined) {
                const firstAmount = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  BUSD[chainId as number],
                ]);
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [BUSD[chainId as number], CurrencyB]
                );
                const output = formatAmount(secondAmount[1]);

                setPath([
                  CurrencyA as string,
                  BUSD[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA.symbol} - BUSD - ${currencyB.symbol}`
                );

                setAmount(output);
              } else {
                setAmount('');
                setPathSymbol('');
                setPath([]);
              }
            } else if (
              RGPTOKENA !== ZERO_ADDRESS &&
              USDTRGP !== ZERO_ADDRESS &&
              USDTTOKENB !== ZERO_ADDRESS
            ) {
              if (amountIn !== undefined) {
                const firstAmount = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  RGPADDRESSES[chainId as number],
                ]);
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [RGPADDRESSES[chainId as number], USDT[chainId as number]]
                );

                const thirdAmount = await SwapRouter.getAmountsOut(
                  secondAmount[1].toString(),
                  [USDT[chainId as number], CurrencyB]
                );
                const output = formatAmount(thirdAmount[1]);
                setPath([
                  CurrencyA as string,
                  RGPADDRESSES[chainId as number],
                  USDT[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA.symbol} - RGP - USDT - ${currencyB.symbol}`
                );

                setAmount(output);
              } else {
                setAmount('');
                setPathSymbol('');
                setPath([]);
              }
            } else if (
              USDTTOKENA !== ZERO_ADDRESS &&
              USDTNATIVE !== ZERO_ADDRESS &&
              NATIVETOKENB !== ZERO_ADDRESS
            ) {
              if (amountIn !== undefined) {
                const firstAmount = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  USDT[chainId as number],
                ]);
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [USDT[chainId as number], WNATIVEADDRESSES[chainId as number]]
                );

                const thirdAmount = await SwapRouter.getAmountsOut(
                  secondAmount[1].toString(),
                  [WNATIVEADDRESSES[chainId as number], CurrencyB]
                );
                const output = formatAmount(thirdAmount[1]);
                setPath([
                  CurrencyA as string,
                  USDT[chainId as number],
                  WNATIVEADDRESSES[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA.symbol} - USDT - ${
                    SupportedChainSymbols[chainId as number]
                  } - ${currencyB.symbol}`
                );

                setAmount(output);
              } else {
                setAmount('');
                setPathSymbol('');
                setPath([]);
              }
            }
          } catch (e) {
            console.log(e);
          }
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

  return [address, wrap, amount, pathArray, pathSymbol];
};

//const formattedInput = ethers.utils.parseEther(amountIn);
