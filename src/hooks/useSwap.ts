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
  SYMBOLS,
} from "../utils/addresses";
import { ZERO_ADDRESS } from "../constants";
import { ethers } from "ethers";
import { getAddress } from "../utils/hooks/usePools";
import { SupportedChainSymbols } from "../utils/constants/chains";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state";
import { getNativeAddress } from "../utils/hooks/usePools";
import { getDecimals } from "../utils/utilsFunctions";
import { useCurrency } from "./Tokens";
import { changeIndependentField } from "../state/swap/actions";
import { Field } from "../state/swap/actions";

const formatAmount = (number: string, decimals: number) => {
  return ethers.utils.formatUnits(number, decimals);
};

export function tryParseAmount<T extends Currency>(
  value?: string,
  decimals?: number
): string | undefined {
  if (!value || !decimals) {
    return undefined;
  }
  try {
    // console.log(currency);
    const typedValueParsed = ethers.utils
      .parseUnits(value, decimals)
      .toString();

    console.log(typedValueParsed);
    if (typedValueParsed !== "0") {
      return typedValueParsed;
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

export const useSwap = (
  currencyA: Currency,
  currencyB: Currency,
  amountIn?: string,
  isExactIn?: string,
  Input?: Currency,
  Output?: Currency
) => {
  const { chainId, library } = useActiveWeb3React();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>("");
  const [wrap, setWrap] = useState<boolean>(false);
  const [pathArray, setPath] = useState<string[] | undefined>(undefined);
  const [pathSymbol, setPathSymbol] = useState("");

  const independentFieldString = useSelector<RootState, string>(
    (state) => state.swap.independentField
  );

  const Id1 = useSelector<RootState, string | undefined>(
    (state) => state.swap.INPUT.currencyId
  );

  const Id2 = useSelector<RootState, string | undefined>(
    (state) => state.swap.OUTPUT.currencyId
  );

  const typedValue = useSelector<RootState, string>(
    (state) => state.swap.typedValue
  );
  const dispatch = useDispatch();
  const changeField = useCallback(
    (inputfield: string, output: string) => {
      if (inputfield === "OUTPUT" && output) {
        dispatch(
          changeIndependentField({ field: Field.INPUT, typedValue: output })
        );
      }
    },
    [dispatch]
  );

  let nativeAddress;

  if (!currencyA || !currencyB) {
    nativeAddress = undefined;
  }

  if (currencyA?.isNative || currencyB?.isNative) {
    nativeAddress = { address: WNATIVEADDRESSES[chainId as number] };
  }

  // const [tokenA, tokenB] = chainId
  //   ? [currencyA?.wrapped, currencyB?.wrapped]
  //   : [undefined, undefined];

  // const [tokenA, tokenB] = [
  //   useCurrency(Id1)?.wrapped,
  //   useCurrency(Id2)?.wrapped,
  // ];

  const [tokenA, tokenB] = chainId
    ? [currencyA?.wrapped, currencyB?.wrapped]
    : [undefined, undefined];

  const [inputCurrency, outputCurrency] = chainId
    ? [Input?.wrapped, Output?.wrapped]
    : [undefined, undefined];

  const inputAddress = inputCurrency?.address || nativeAddress?.address;
  const outputAddress = outputCurrency?.address || nativeAddress?.address;
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
          SYMBOLS[Id1 as string]?.[chainId as number]
            ? SYMBOLS[Id1 as string]?.[chainId as number]
            : Id1,
          SYMBOLS[Id2 as string]?.[chainId as number]
            ? SYMBOLS[Id2 as string]?.[chainId as number]
            : Id2
        );
        setAddress(pairAddress);

        const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
          ? SYMBOLS[Id1 as string]?.[chainId as number]
          : Id1;

        console.log(address1);

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
            const decimal1 = await getDecimals(
              SYMBOLS[Id1 as string]?.[chainId as number]
                ? SYMBOLS[Id1]?.[chainId as number]
                : Id1,
              library
            );
            const decimal2 = await getDecimals(
              SYMBOLS[Id2 as string]?.[chainId as number]
                ? SYMBOLS[Id2]?.[chainId as number]
                : Id2,
              library
            );

            const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
              ? SYMBOLS[Id1 as string]?.[chainId as number]
              : Id1;
            const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
              ? SYMBOLS[Id2 as string]?.[chainId as number]
              : Id2;

            const amountOut = await SwapRouter.getAmountsOut(
              independentFieldString === "INPUT"
                ? tryParseAmount(typedValue, decimal1)
                : tryParseAmount(typedValue, decimal2),
              [
                independentFieldString === "INPUT" ? address1 : address2,
                independentFieldString === "INPUT" ? address2 : address1,
              ]
            );

            const output = formatAmount(
              amountOut[1],
              independentFieldString === "INPUT" ? decimal2 : decimal1
            );

            setPath([inputAddress as string, outputAddress as string]);

            changeField(independentFieldString, output);

            setPathSymbol(`${Input?.symbol} - ${Output?.symbol}`);
            setAmount(output);
          } else {
            setAmount("");
          }
          // setLoading(false)
        } else if (!wrappable && address === ZERO_ADDRESS) {
          //   setWrap(true);
          setWrap(false);
          // RGP BNB BUSD USDT
          const CurrencyA = SYMBOLS[Id1 as string]?.[chainId as number]
            ? SYMBOLS[Id1 as string]?.[chainId as number]
            : Id1;
          const CurrencyB = SYMBOLS[Id2 as string]?.[chainId as number]
            ? SYMBOLS[Id2 as string]?.[chainId as number]
            : Id2;
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
                const decimal1 = await getDecimals(
                  SYMBOLS[Id1 as string]?.[chainId as number]
                    ? SYMBOLS[Id1]?.[chainId as number]
                    : Id1,
                  library
                );
                const decimal2 = await getDecimals(
                  SYMBOLS[Id2 as string]?.[chainId as number]
                    ? SYMBOLS[Id2]?.[chainId as number]
                    : Id2,
                  library
                );

                const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
                  ? SYMBOLS[Id1 as string]?.[chainId as number]
                  : Id1;
                const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
                  ? SYMBOLS[Id2 as string]?.[chainId as number]
                  : Id2;

                const firstAmount = await SwapRouter.getAmountsOut(
                  independentFieldString === "INPUT"
                    ? tryParseAmount(typedValue, decimal1)
                    : tryParseAmount(typedValue, decimal2),
                  [
                    independentFieldString === "INPUT" ? address1 : address2,
                    USDT[chainId as number],
                  ]
                );
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [
                    USDT[chainId as number],
                    independentFieldString === "INPUT" ? address2 : address1,
                  ]
                );

                const output = formatAmount(
                  secondAmount[1],
                  independentFieldString === "INPUT" ? decimal2 : decimal1
                );
                setPath([
                  independentFieldString === "INPUT"
                    ? (inputAddress as string)
                    : (outputAddress as string),
                  USDT[chainId as number],
                  independentFieldString === "INPUT"
                    ? (outputAddress as string)
                    : (inputAddress as string),
                ]);
                setPathSymbol(`${Input?.symbol} - USDT - ${Output?.symbol}`);

                changeField(independentFieldString, output);

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
                const decimal1 = await getDecimals(
                  SYMBOLS[Id1 as string]?.[chainId as number]
                    ? SYMBOLS[Id1]?.[chainId as number]
                    : Id1,
                  library
                );
                const decimal2 = await getDecimals(
                  SYMBOLS[Id2 as string]?.[chainId as number]
                    ? SYMBOLS[Id2]?.[chainId as number]
                    : Id2,
                  library
                );

                const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
                  ? SYMBOLS[Id1 as string]?.[chainId as number]
                  : Id1;
                const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
                  ? SYMBOLS[Id2 as string]?.[chainId as number]
                  : Id2;

                const firstAmount = await SwapRouter.getAmountsOut(
                  independentFieldString === "INPUT"
                    ? tryParseAmount(typedValue, decimal1)
                    : tryParseAmount(typedValue, decimal2),
                  [
                    independentFieldString === "INPUT" ? address1 : address2,
                    RGPADDRESSES[chainId as number],
                  ]
                );
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [
                    RGPADDRESSES[chainId as number],
                    independentFieldString === "INPUT" ? address2 : address1,
                  ]
                );
                const output = formatAmount(
                  secondAmount[1],
                  independentFieldString === "INPUT" ? decimal2 : decimal1
                );
                setPath([
                  independentFieldString === "INPUT"
                    ? (inputAddress as string)
                    : (outputAddress as string),
                  RGPADDRESSES[chainId as number],
                  independentFieldString === "INPUT"
                    ? (outputAddress as string)
                    : (inputAddress as string),
                ]);
                setPathSymbol(`${Input?.symbol} - RGP - ${Output?.symbol}`);

                changeField(independentFieldString, output);

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
                const decimal1 = await getDecimals(
                  SYMBOLS[Id1 as string]?.[chainId as number]
                    ? SYMBOLS[Id1]?.[chainId as number]
                    : Id1,
                  library
                );
                const decimal2 = await getDecimals(
                  SYMBOLS[Id2 as string]?.[chainId as number]
                    ? SYMBOLS[Id2]?.[chainId as number]
                    : Id2,
                  library
                );

                const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
                  ? SYMBOLS[Id1 as string]?.[chainId as number]
                  : Id1;
                const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
                  ? SYMBOLS[Id2 as string]?.[chainId as number]
                  : Id2;

                const firstAmount = await SwapRouter.getAmountsOut(
                  independentFieldString === "INPUT"
                    ? tryParseAmount(typedValue, decimal1)
                    : tryParseAmount(typedValue, decimal2),
                  [
                    independentFieldString === "INPUT" ? address1 : address2,
                    WNATIVEADDRESSES[chainId as number],
                  ]
                );
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [
                    WNATIVEADDRESSES[chainId as number],
                    independentFieldString === "INPUT" ? address2 : address1,
                  ]
                );
                const output = formatAmount(
                  secondAmount[1],
                  independentFieldString === "INPUT" ? decimal2 : decimal1
                );
                setPath([
                  independentFieldString === "INPUT"
                    ? (inputAddress as string)
                    : (outputAddress as string),
                  WNATIVEADDRESSES[chainId as number],
                  independentFieldString === "INPUT"
                    ? (outputAddress as string)
                    : (inputAddress as string),
                ]);
                setPathSymbol(
                  `${Input?.symbol} - ${
                    SupportedChainSymbols[chainId as number]
                  } - ${Output?.symbol}`
                );

                changeField(independentFieldString, output);

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
                const decimal1 = await getDecimals(
                  SYMBOLS[Id1 as string]?.[chainId as number]
                    ? SYMBOLS[Id1]?.[chainId as number]
                    : Id1,
                  library
                );
                const decimal2 = await getDecimals(
                  SYMBOLS[Id2 as string]?.[chainId as number]
                    ? SYMBOLS[Id2]?.[chainId as number]
                    : Id2,
                  library
                );

                const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
                  ? SYMBOLS[Id1 as string]?.[chainId as number]
                  : Id1;
                const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
                  ? SYMBOLS[Id2 as string]?.[chainId as number]
                  : Id2;

                const firstAmount = await SwapRouter.getAmountsOut(
                  independentFieldString === "INPUT"
                    ? tryParseAmount(typedValue, decimal1)
                    : tryParseAmount(typedValue, decimal2),
                  [
                    independentFieldString === "INPUT" ? address1 : address2,
                    BUSD[chainId as number],
                  ]
                );
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [
                    BUSD[chainId as number],
                    independentFieldString === "INPUT" ? address2 : address1,
                  ]
                );
                const output = formatAmount(
                  secondAmount[1],
                  independentFieldString === "INPUT" ? decimal2 : decimal1
                );

                setPath([
                  independentFieldString === "INPUT"
                    ? (inputAddress as string)
                    : (outputAddress as string),
                  BUSD[chainId as number],
                  independentFieldString === "INPUT"
                    ? (outputAddress as string)
                    : (inputAddress as string),
                ]);
                setPathSymbol(`${Input?.symbol} - BUSD - ${Output?.symbol}`);

                changeField(independentFieldString, output);

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
                const decimal1 = await getDecimals(
                  SYMBOLS[Id1 as string]?.[chainId as number]
                    ? SYMBOLS[Id1]?.[chainId as number]
                    : Id1,
                  library
                );
                const decimal2 = await getDecimals(
                  SYMBOLS[Id2 as string]?.[chainId as number]
                    ? SYMBOLS[Id2]?.[chainId as number]
                    : Id2,
                  library
                );

                const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
                  ? SYMBOLS[Id1 as string]?.[chainId as number]
                  : Id1;
                const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
                  ? SYMBOLS[Id2 as string]?.[chainId as number]
                  : Id2;

                const firstAmount = await SwapRouter.getAmountsOut(
                  independentFieldString === "INPUT"
                    ? tryParseAmount(typedValue, decimal1)
                    : tryParseAmount(typedValue, decimal2),
                  [
                    independentFieldString === "INPUT" ? address1 : address2,
                    RGPADDRESSES[chainId as number],
                  ]
                );
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [RGPADDRESSES[chainId as number], USDT[chainId as number]]
                );

                const thirdAmount = await SwapRouter.getAmountsOut(
                  secondAmount[1].toString(),
                  [
                    USDT[chainId as number],
                    independentFieldString === "INPUT" ? address2 : address1,
                  ]
                );
                const output = formatAmount(
                  thirdAmount[1],
                  independentFieldString === "INPUT" ? decimal2 : decimal1
                );
                setPath([
                  independentFieldString === "INPUT"
                    ? (inputAddress as string)
                    : (outputAddress as string),
                  RGPADDRESSES[chainId as number],
                  USDT[chainId as number],
                  independentFieldString === "INPUT"
                    ? (outputAddress as string)
                    : (inputAddress as string),
                ]);
                setPathSymbol(
                  `${Input?.symbol} - RGP - USDT - ${Output?.symbol}`
                );

                changeField(independentFieldString, output);

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
                const decimal1 = await getDecimals(
                  SYMBOLS[Id1 as string]?.[chainId as number]
                    ? SYMBOLS[Id1]?.[chainId as number]
                    : Id1,
                  library
                );
                const decimal2 = await getDecimals(
                  SYMBOLS[Id2 as string]?.[chainId as number]
                    ? SYMBOLS[Id2]?.[chainId as number]
                    : Id2,
                  library
                );

                const address1 = SYMBOLS[Id1 as string]?.[chainId as number]
                  ? SYMBOLS[Id1 as string]?.[chainId as number]
                  : Id1;
                const address2 = SYMBOLS[Id2 as string]?.[chainId as number]
                  ? SYMBOLS[Id2 as string]?.[chainId as number]
                  : Id2;

                const firstAmount = await SwapRouter.getAmountsOut(
                  independentFieldString === "INPUT"
                    ? tryParseAmount(typedValue, decimal1)
                    : tryParseAmount(typedValue, decimal2),
                  [
                    independentFieldString === "INPUT" ? address1 : address2,
                    USDT[chainId as number],
                  ]
                );
                const secondAmount = await SwapRouter.getAmountsOut(
                  firstAmount[1].toString(),
                  [USDT[chainId as number], WNATIVEADDRESSES[chainId as number]]
                );

                const thirdAmount = await SwapRouter.getAmountsOut(
                  secondAmount[1].toString(),
                  [
                    WNATIVEADDRESSES[chainId as number],
                    independentFieldString === "INPUT" ? address2 : address1,
                  ]
                );
                const output = formatAmount(
                  thirdAmount[1],
                  independentFieldString === "INPUT" ? decimal2 : decimal1
                );
                setPath([
                  independentFieldString === "INPUT"
                    ? (inputAddress as string)
                    : (outputAddress as string),
                  USDT[chainId as number],
                  WNATIVEADDRESSES[chainId as number],
                  independentFieldString === "INPUT"
                    ? (outputAddress as string)
                    : (inputAddress as string),
                ]);
                setPathSymbol(
                  `${Input?.symbol} - USDT - ${
                    SupportedChainSymbols[chainId as number]
                  } - ${Output?.symbol}`
                );

                changeField(independentFieldString, output);

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
    Id1,
    Id2,
  ]);

  return [address, wrap, amount, pathArray, pathSymbol];
};
