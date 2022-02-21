import { Currency } from "@uniswap/sdk-core";
import { useEffect, useState, useCallback } from "react";
import { useActiveWeb3React } from "../utils/hooks/useActiveWeb3React";
import { smartFactory, SmartSwapRouter } from "../utils/Contracts";
import {
  BUSD,
  RGPADDRESSES,
  SMARTSWAPFACTORYADDRESSES,
  SMARTSWAPROUTER,
  USDT,
  WNATIVEADDRESSES,
} from "../utils/addresses";
import { ZERO_ADDRESS } from "../constants";
import { ethers } from "ethers";
import { getAddress } from "../utils/hooks/usePools";
import { SupportedChainSymbols } from "../utils/constants/chains";
import { useSelector } from "react-redux";
import { RootState } from "../state";
import { getNativeAddress } from "../utils/hooks/usePools";
import { getDecimals } from "../utils/utilsFunctions";

const formatAmount = (number: string, decimals: number) => {
  return ethers.utils.formatUnits(number, decimals);
};

export const useSwap = (
  currencyA: Currency,
  currencyB: Currency,
  amountIn?: string,
  isExactIn?: string
) => {
  const { chainId, library } = useActiveWeb3React();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>("");
  const [wrap, setWrap] = useState<boolean>(false);
  const [pathArray, setPath] = useState<string[] | undefined>(undefined);
  const [pathSymbol, setPathSymbol] = useState("");

  // console.log("currency A -->", currencyA);
  // console.log("currency B -->", currencyB);

  const independentFieldString = useSelector<RootState, string>(
    (state) => state.swap.independentField
  );

  const Id1 = useSelector<RootState, string>(
    (state) => state.swap.INPUT.currencyId
  );

  const Id2 = useSelector<RootState, string>(
    (state) => state.swap.OUTPUT.currencyId
  );

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
  if (SMARTSWAPFACTORYADDRESSES[chainId as number] !== "0x") {
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

        if (wrappable) {
          setWrap(true);
        }

        if (!wrappable && address !== ZERO_ADDRESS) {
          setWrap(false);
          if (amountIn !== undefined) {
            const SwapRouter = await SmartSwapRouter(
              SMARTSWAPROUTER[chainId as number],
              library
            );
            console.log("currencyOne -->", Id1);
            console.log("currencyTwo -->", Id2);
            console.log("tokenOne -->", tokenOneAddress);

            console.log("tokenTwo -->", tokenTwoAddress);
            console.log("amountIn", amountIn);

            const amountOut = await SwapRouter.getAmountsOut(amountIn, [
              tokenA?.address,
              tokenB?.address,
            ]);

            const output = formatAmount(amountOut[1], currencyB.decimals);
            console.log(output);

            setPath([tokenOneAddress as string, tokenTwoAddress as string]);
            setPathSymbol(`${currencyA.symbol} - ${currencyB.symbol}`);
            setAmount(output);
          } else {
            setAmount("");
          }
          // setLoading(false)
        } else if (!wrappable && address === ZERO_ADDRESS) {
          //   setWrap(true);
          setWrap(false);
          // RGP BNB BUSD USDT
          const CurrencyA = getAddress(currencyA);
          const CurrencyB = getAddress(currencyB);
          const factory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number],
            library
          );
          const SwapRouter = await SmartSwapRouter(
            SMARTSWAPROUTER[chainId as number],
            library
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

                const output = formatAmount(
                  secondAmount[1],
                  currencyB.decimals
                );
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
                setAmount("");
                setPathSymbol("");
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
                const output = formatAmount(
                  secondAmount[1],
                  currencyB.decimals
                );
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
                setAmount("");
                setPathSymbol("");
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
                const output = formatAmount(
                  secondAmount[1],
                  currencyB.decimals
                );
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
                setAmount("");
                setPathSymbol("");
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
                const output = formatAmount(
                  secondAmount[1],
                  currencyB.decimals
                );

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
                setAmount("");
                setPathSymbol("");
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
                const output = formatAmount(thirdAmount[1], currencyB.decimals);
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
                setAmount("");
                setPathSymbol("");
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
                const output = formatAmount(thirdAmount[1], currencyB.decimals);
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
                setAmount("");
                setPathSymbol("");
                setPath([]);
              }
            }
          } catch (e) {
            console.log("Selected Currency Address cannot be matched");
          }
        } else {
          setAmount("");
          setPathSymbol("");
          setPath([]);
        }
      } catch (e) {
        console.log(`Error occurs here: ${e}`);
        setAmount("");
      }
    };

    getPairs();
  }, [
    currencyA,
    currencyB,
    address,
    amountIn,
    wrap,
    tokenOneAddress,
    tokenTwoAddress,
    tokenA,
    tokenB,
    independentFieldString,
  ]);

  return [address, wrap, amount, pathArray, pathSymbol];
};
