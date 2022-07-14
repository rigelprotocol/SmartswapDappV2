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
import { isAddress } from "../utils";

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
  marketFactory?:string,
  marketRouterAddress?:string,
  unit?:string,
) => {
  const { chainId, library } = useActiveWeb3React();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>("");
  const [oppositeAmount, setOppositeAmount] = useState<string | undefined>("0");
  const [wrap, setWrap] = useState<boolean>(false);
  const [pathArray, setPath] = useState<string[] | undefined>(undefined);
  const [pathSymbol, setPathSymbol] = useState("");

  const independentFieldString = useSelector<RootState, string>(
    (state) => state.swap.independentField
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

  
  
  useEffect(() => {
    const getPairs = async () => {
      const wrappable: boolean = tokenOneAddress == tokenTwoAddress;
  let validSmartAddress: string | undefined;
  if (SMARTSWAPFACTORYADDRESSES[chainId as number] !== "0x") {
    // validSmartAddress =  SMARTSWAPFACTORYADDRESSES[chainId as number];
    
    validSmartAddress = isAddress(marketFactory) ? marketFactory : SMARTSWAPFACTORYADDRESSES[chainId as number];
  }
  
      try {
        const SmartFactory = await smartFactory(validSmartAddress ? validSmartAddress :  SMARTSWAPFACTORYADDRESSES[chainId as number], library);
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
           
            // const SwapRouter = await SmartSwapRouter(
            //   SMARTSWAPROUTER[chainId as number],
            //   library
            // );
            const SwapRouter = await SmartSwapRouter(
              marketRouterAddress ? marketRouterAddress : SMARTSWAPROUTER[chainId as number],
               library
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
            if(unit){
              const amountOut2= await SwapRouter.getAmountsOut( `${10**currencyB?.decimals}`, [
                  tokenTwoAddress,
                  tokenOneAddress,
                ]);
            const output2 = formatAmount(amountOut2[1], currencyA.decimals);
            setOppositeAmount(output2)
            }
            
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
            validSmartAddress ? validSmartAddress :  SMARTSWAPFACTORYADDRESSES[chainId as number],
            library
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
           marketRouterAddress ? marketRouterAddress : SMARTSWAPROUTER[chainId as number],
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
                  USDT[chainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                      CurrencyA,
                      USDT[chainId as number],
                      CurrencyB,
                    ]);
                    const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);
                           
                setPath([
                  CurrencyA as string,
                  USDT[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - USDT - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if(unit){
                  const amountsOut2 = await SwapRouter.getAmountsOut(`${10**currencyB?.decimals}`, [
                  CurrencyB,
                  USDT[chainId as number],
                  CurrencyA,
                ]) 
                 const output2 = formatAmount(amountsOut2[2], currencyA.decimals);
                setAmount(output2)
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
                  RGPADDRESSES[chainId as number],
                  CurrencyB,
                ]);
                
                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                      CurrencyA,
                      RGPADDRESSES[chainId as number],
                      CurrencyB,
                    ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);
                setPath([
                  CurrencyA as string,
                  RGPADDRESSES[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - RGP - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if(unit){
                  const amountsOut2 = await SwapRouter.getAmountsOut(`${10**currencyB?.decimals}`, [
                    CurrencyB,
                    RGPADDRESSES[chainId as number],
                    CurrencyA,
                  ]);
  
                  const output2 = formatAmount(amountsOut2[2], currencyA.decimals);
                  setOppositeAmount(output2)
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
                  WNATIVEADDRESSES[chainId as number],
                  CurrencyB,
                ]);
               

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                      CurrencyA,
                      WNATIVEADDRESSES[chainId as number],
                      CurrencyB,
                    ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);
            
                setPath([
                  CurrencyA as string,
                  WNATIVEADDRESSES[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - ${SupportedChainSymbols[chainId as number]
                  } - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if(unit){
                  const amountsOut2 = await SwapRouter.getAmountsOut(`${10**currencyB?.decimals}`, [
                    CurrencyB,
                    WNATIVEADDRESSES[chainId as number],
                    CurrencyA,
                  ]);
                  const output2 = formatAmount(amountsOut2[2], currencyA.decimals);
                  setOppositeAmount(output2)
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
                  BUSD[chainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                      CurrencyA,
                      BUSD[chainId as number],
                      CurrencyB,
                    ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[2], currencyB.decimals);

                setPath([
                  CurrencyA as string,
                  BUSD[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - BUSD - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if(unit){
                  const amountsOut2 = await SwapRouter.getAmountsOut(`${10**currencyB?.decimals}`, [
                    CurrencyB,
                    BUSD[chainId as number],
                    CurrencyA,
                  ]);
                  const output2 = formatAmount(amountsOut2[2], currencyA.decimals);
                  setOppositeAmount(output2)
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
                  RGPADDRESSES[chainId as number],
                  USDT[chainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                      CurrencyA,
                      RGPADDRESSES[chainId as number],
                      USDT[chainId as number],
                      CurrencyB,
                    ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[3], currencyB.decimals);
                setPath([
                  CurrencyA as string,
                  RGPADDRESSES[chainId as number],
                  USDT[chainId as number],
                  CurrencyB as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - RGP - USDT - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if(unit){
                  const amountsOut2 = await SwapRouter.getAmountsOut(`${10**currencyB?.decimals}`, [
                    CurrencyB,
                    RGPADDRESSES[chainId as number],
                    USDT[chainId as number],
                    CurrencyA,
                  ]);
                  const output2 = formatAmount(amountsOut2[3], currencyA.decimals);
                  setOppositeAmount(output2)
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
                  USDT[chainId as number],
                  WNATIVEADDRESSES[chainId as number],
                  CurrencyB,
                ]);

                const amountsIn =
                  independentFieldString === "INPUT"
                    ? undefined
                    : await SwapRouter.getAmountsIn(amountIn, [
                      CurrencyA,
                      USDT[chainId as number],
                      WNATIVEADDRESSES[chainId as number],
                      CurrencyB,
                    ]);

                const amountsInOutput =
                  independentFieldString === "INPUT"
                    ? undefined
                    : formatAmount(amountsIn[0], currencyA.decimals);

                const output = formatAmount(amountsOut[3], currencyB.decimals);
                setPath([
                  CurrencyA as string,
                  USDT[chainId as number],
                  WNATIVEADDRESSES[chainId as number],
                  CurrencyA as string,
                ]);
                setPathSymbol(
                  `${currencyA?.symbol} - USDT - ${SupportedChainSymbols[chainId as number]
                  } - ${currencyB?.symbol}`
                );

                setAmount(
                  independentFieldString === "INPUT" ? output : amountsInOutput
                );
                if(unit){
                  const amountsOut2 = await SwapRouter.getAmountsOut(amountIn, [
                    CurrencyB,
                    USDT[chainId as number],
                    WNATIVEADDRESSES[chainId as number],
                    CurrencyA,
                  ]);
                  const output2 = formatAmount(amountsOut2[3], currencyA.decimals);
                  setOppositeAmount(output2)
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
        }
      } catch (e) {
        console.log({e})
        console.log(`Error occurs here: ${e}`);
        setAmount("");
      }
    };

    var interval:any

      if(tokenOneAddress && tokenTwoAddress&& (amountIn ) ){
        interval = setInterval(()=>
          getPairs(),2000)
      }else{
        clearInterval(interval)
      }
 getPairs();
    return () => clearInterval(interval)

   
  }, [
    // currencyA,
    // currencyB,
    address,
    amountIn,
    wrap,
    tokenOneAddress,
    tokenTwoAddress,
    tokenA,
    tokenB,
    independentFieldString,
    oppositeAmount,
    marketFactory,
    marketRouterAddress,
    // account
  ]);
  
  return [address, wrap, amount, pathArray, pathSymbol,oppositeAmount];
};

export {useSwap}