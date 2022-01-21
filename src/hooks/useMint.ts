import { Currency } from "@uniswap/sdk-core";
import { useEffect } from "react";
import { useActiveWeb3React } from "../utils/hooks/useActiveWeb3React";
import { useState } from "react";
import { smartFactory, SmartSwapRouter } from "../utils/Contracts";
import {
  SMARTSWAPFACTORYADDRESSES,
  SMARTSWAPROUTER,
  WNATIVEADDRESSES,
} from "../utils/addresses";
import { ZERO_ADDRESS } from "../constants";
import { ethers } from "ethers";
import { LiquidityPairInstance } from "../utils/Contracts";

const formatAmount = (amount: string, decimals: number) => {
  const num = ethers.utils.formatUnits(amount, decimals);
  return num;
};

export const useMint = (
  currencyA: Currency,
  currencyB: Currency,
  amountIn?: string
) => {
  const { chainId } = useActiveWeb3React();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>("");
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
  if (SMARTSWAPFACTORYADDRESSES[chainId as number] !== "0x") {
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
            const pairinstance = await LiquidityPairInstance(pairAddress);
            const token0 = await pairinstance.token0();
            const token1 = await pairinstance.token1();
            const reserves = await pairinstance.getReserves();

            const SwapRouter = await SmartSwapRouter(
              SMARTSWAPROUTER[chainId as number]
            );

            const outputAmount = await SwapRouter.quote(
              amountIn,
              tokenOneAddress === token0 ? reserves[0] : reserves[1],
              tokenOneAddress === token0 ? reserves[1] : reserves[0]
            );
            
            const output = formatAmount(outputAmount.toString(), currencyB.decimals);

            setAmount(output);
          } else {
            setAmount("");
          }
        }
      } catch (e) {
        console.log(e);
        setAmount("");
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
