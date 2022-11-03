import { Currency } from "@uniswap/sdk-core";
import { useEffect, useState } from "react";
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
import { isAddress } from "../utils";
import { useProvider } from "../utils/utilsFunctions";

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

const useSwap = (
  currencyA: Currency | null | undefined,
  currencyB: Currency | null | undefined,
  amountIn?: string,
  marketFactory?: string,
  marketRouterAddress?: string,
  unit?: string
) => {
  const { chainId, library } = useActiveWeb3React();
  const [address, setAddress] = useState<string>();
  const [amount, setAmount] = useState<string | undefined>("");
  const [oppositeAmount, setOppositeAmount] = useState<string | undefined>("0");
  const [wrap, setWrap] = useState<boolean>(false);
  const [pathArray, setPath] = useState<string[] | undefined>(undefined);
  const [pathSymbol, setPathSymbol] = useState("");
  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);
  const { prov } = useProvider();
  const lib = library ? library : prov;

  const independentFieldString = useSelector<RootState, string>(
    (state) => state.swap.independentField
  );

  let nativeAddress;

  if (!currencyA || !currencyB) {
    nativeAddress = undefined;
  }

  if (currencyA?.isNative || currencyB?.isNative) {
    nativeAddress = { address: WNATIVEADDRESSES[ChainId as number] };
  }

  const [tokenA, tokenB] = ChainId
    ? [currencyA?.wrapped, currencyB?.wrapped]
    : [undefined, undefined];
  const tokenOneAddress = tokenA?.address || nativeAddress?.address;
  const tokenTwoAddress = tokenB?.address || nativeAddress?.address;

  useEffect(() => {
    const getPairs = async () => {
      const wrappable: boolean = tokenOneAddress == tokenTwoAddress;
      let validSmartAddress: string | undefined;
      if (SMARTSWAPFACTORYADDRESSES[ChainId as number]) {
        validSmartAddress = isAddress(marketFactory)
          ? marketFactory
          : SMARTSWAPFACTORYADDRESSES[ChainId as number];
      }
      try {
        const SmartFactory = await smartFactory(
          validSmartAddress
            ? validSmartAddress
            : SMARTSWAPFACTORYADDRESSES[ChainId as number],
          lib
        );
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
              marketRouterAddress
                ? marketRouterAddress
                : SMARTSWAPROUTER[ChainId as number],
              lib
            );

            const amountOut = await SwapRouter.getAmountsOut(amountIn, [
              tokenOneAddress,
              tokenTwoAddress,
            ]);
            const amountsIn =
              independentFieldString === "INPUT"
                ? undefined
                : await SwapRouter.getAmountsIn(amountIn, [
                    tokenOneAddress,
                    tokenTwoAddress,
                  ]);

            const output = formatAmount(amountOut[1], currencyB.decimals);

            const amountsInOutput =
              independentFieldString === "INPUT"
                ? undefined
                : formatAmount(amountsIn[0], currencyA.decimals);

            setPath([tokenOneAddress as string, tokenTwoAddress as string]);

            setPathSymbol(`${currencyA?.symbol} - ${currencyB?.symbol}`);
            setAmount(
              independentFieldString === "INPUT" ? output : amountsInOutput
            );
            if (unit) {
              const amountOut2 = await SwapRouter.getAmountsOut(
                `${10 ** currencyB?.decimals}`,
                [tokenTwoAddress, tokenOneAddress]
              );
              const output2 = formatAmount(amountOut2[1], currencyA.decimals);
              setOppositeAmount(output2);
            }
          } else {
            setAmount("");
          }
          // setLoading(false)
        } else if (!wrappable && address === ZERO_ADDRESS && pairAddress === ZERO_ADDRESS ) {
          //   setWrap(true);
          setWrap(false);
          // RGP BNB BUSD USDT
          const CurrencyA = getAddress(currencyA);
          const CurrencyB = getAddress(currencyB);
          const factory = await smartFactory(
            validSmartAddress
              ? validSmartAddress
              : SMARTSWAPFACTORYADDRESSES[ChainId as number],
            lib
          );
          // const factory = await smartFactory(
          //   SMARTSWAPFACTORYADDRESSES[chainId as number],
          //   library
          // );
          // const SwapRouter = await SmartSwapRouter(
          //   SMARTSWAPROUTER[chainId as number],
          //   library
          // );
          const SwapRouter = await SmartSwapRouter(
            marketRouterAddress
              ? marketRouterAddress
              : SMARTSWAPROUTER[ChainId as number],
            lib
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
            factory.getPair(RGPADDRESSES[ChainId as number], CurrencyA),
            factory.getPair(RGPADDRESSES[ChainId as number], CurrencyB),
            factory.getPair(WNATIVEADDRESSES[ChainId as number], CurrencyA),
            factory.getPair(WNATIVEADDRESSES[ChainId as number], CurrencyB),
            factory.getPair(BUSD[ChainId as number], CurrencyA),
            factory.getPair(BUSD[ChainId as number], CurrencyB),
            factory.getPair(USDT[ChainId as number], CurrencyA),
            factory.getPair(USDT[ChainId as number], CurrencyB),
          ]);

          const [USDTRGP, USDTNATIVE] = await Promise.all([
            factory.getPair(
              USDT[ChainId as number],
              RGPADDRESSES[ChainId as number]
            ),
            factory.getPair(
              USDT[ChainId as number],
              WNATIVEADDRESSES[ChainId as number]
            ),
          ]);
          // console.log({  RGPTOKENA,
          //             RGPTOKENB,
          //             NATIVETOKENA,
          //             NATIVETOKENB,
          //             BUSDTOKENA,
          //             BUSDTOKENB,
          //             USDTTOKENA,
          //             USDTTOKENB,USDTRGP, USDTNATIVE})
          try {
            if (USDTTOKENA !== ZERO_ADDRESS && USDTTOKENB !== ZERO_ADDRESS) {
              if (amountIn !== undefined) {
                const amountsOut = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  USDT[ChainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                        CurrencyA,
                        USDT[ChainId as number],
                        CurrencyB,
                      ]);
                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);

                setPath([
                  CurrencyA as string,
                  USDT[ChainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - USDT - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if (unit) {
                  const amountsOut2 = await SwapRouter.getAmountsOut(
                    `${10 ** currencyB?.decimals}`,
                    [CurrencyB, USDT[ChainId as number], CurrencyA]
                  );
                  const output2 = formatAmount(
                    amountsOut2[2],
                    currencyA.decimals
                  );
                  setAmount(output2);
                }
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
                const amountsOut = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  RGPADDRESSES[ChainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                        CurrencyA,
                        RGPADDRESSES[ChainId as number],
                        CurrencyB,
                      ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);
                setPath([
                  CurrencyA as string,
                  RGPADDRESSES[ChainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - RGP - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if (unit) {
                  const amountsOut2 = await SwapRouter.getAmountsOut(
                    `${10 ** currencyB?.decimals}`,
                    [CurrencyB, RGPADDRESSES[ChainId as number], CurrencyA]
                  );

                  const output2 = formatAmount(
                    amountsOut2[2],
                    currencyA.decimals
                  );
                  setOppositeAmount(output2);
                }
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
                const amountsOut = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  WNATIVEADDRESSES[ChainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                        CurrencyA,
                        WNATIVEADDRESSES[ChainId as number],
                        CurrencyB,
                      ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);

                setPath([
                  CurrencyA as string,
                  WNATIVEADDRESSES[ChainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - ${
                    SupportedChainSymbols[ChainId as number]
                  } - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if (unit) {
                  const amountsOut2 = await SwapRouter.getAmountsOut(
                    `${10 ** currencyB?.decimals}`,
                    [CurrencyB, WNATIVEADDRESSES[ChainId as number], CurrencyA]
                  );
                  const output2 = formatAmount(
                    amountsOut2[2],
                    currencyA.decimals
                  );
                  setOppositeAmount(output2);
                }
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
                const amountsOut = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  BUSD[ChainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                        CurrencyA,
                        BUSD[ChainId as number],
                        CurrencyB,
                      ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);

                setPath([
                  CurrencyA as string,
                  BUSD[ChainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - BUSD - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if (unit) {
                  const amountsOut2 = await SwapRouter.getAmountsOut(
                    `${10 ** currencyB?.decimals}`,
                    [CurrencyB, BUSD[ChainId as number], CurrencyA]
                  );
                  const output2 = formatAmount(
                    amountsOut2[2],
                    currencyA.decimals
                  );
                  setOppositeAmount(output2);
                }
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
                const amountsOut = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  RGPADDRESSES[ChainId as number],
                  USDT[ChainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                        CurrencyA,
                        RGPADDRESSES[ChainId as number],
                        USDT[ChainId as number],
                        CurrencyB,
                      ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[3], currencyB.decimals);
                setPath([
                  CurrencyA as string,
                  RGPADDRESSES[ChainId as number],
                  USDT[ChainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - RGP - USDT - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if (unit) {
                  const amountsOut2 = await SwapRouter.getAmountsOut(
                    `${10 ** currencyB?.decimals}`,
                    [
                      CurrencyB,
                      RGPADDRESSES[ChainId as number],
                      USDT[ChainId as number],
                      CurrencyA,
                    ]
                  );
                  const output2 = formatAmount(
                    amountsOut2[3],
                    currencyA.decimals
                  );
                  setOppositeAmount(output2);
                }
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
                const amountsOut = await SwapRouter.getAmountsOut(amountIn, [
                  CurrencyA,
                  USDT[ChainId as number],
                  WNATIVEADDRESSES[ChainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                        CurrencyA,
                        USDT[ChainId as number],
                        WNATIVEADDRESSES[ChainId as number],
                        CurrencyB,
                      ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[3], currencyB.decimals);
                setPath([
                  CurrencyA as string,
                  USDT[ChainId as number],
                  WNATIVEADDRESSES[ChainId as number],
                  CurrencyA as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - USDT - ${
                    SupportedChainSymbols[ChainId as number]
                  } - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if (unit) {
                  const amountsOut2 = await SwapRouter.getAmountsOut(amountIn, [
                    CurrencyB,
                    USDT[ChainId as number],
                    WNATIVEADDRESSES[ChainId as number],
                    CurrencyA,
                  ]);
                  const output2 = formatAmount(
                    amountsOut2[3],
                    currencyA.decimals
                  );
                  setOppositeAmount(output2);
                }
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
          setOppositeAmount("")
        }
      } catch (e) {
        console.log({ e });
        console.log(`Error occurs here: ${e}`);
        setAmount("");
      }
    };

    var interval: any;

    if (tokenOneAddress && tokenTwoAddress && amountIn) {
      interval = setInterval(() => getPairs(), 2000);
    } else {
      clearInterval(interval);
    }
    getPairs();
    return () => clearInterval(interval);
  }, [
    // currencyA,
    // currencyB,
    address,
    amountIn,
    wrap,
    tokenOneAddress,
    tokenTwoAddress,
    // tokenA,
    // tokenB,
    independentFieldString,
    oppositeAmount,
    marketFactory,
    // marketRouterAddress,
    // account
  ]);

  return [address, wrap, amount, pathArray, pathSymbol, oppositeAmount];
};

export { useSwap };
