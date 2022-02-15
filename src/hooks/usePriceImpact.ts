import React, { useMemo, useState } from "react";
import { SmartSwapRouter } from "../utils/Contracts";
import { SMARTSWAPROUTER } from "../utils/addresses";
import { ethers } from "ethers";
import { useActiveWeb3React } from "../utils/hooks/useActiveWeb3React";
import { Currency } from "@uniswap/sdk-core";

export const useCalculatePriceImpact = (
  routeAddress: any,
  amountIn: number,
  fromAmount: number,
  currencyB: Currency
) => {
  const { account, chainId, library } = useActiveWeb3React();
  const [priceImpact, setPriceImpact] = useState("");

  useMemo(async () => {
    if (routeAddress && amountIn && fromAmount) {
      const rout = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      if (routeAddress.length === 2) {
        try {
          const price = await rout.getAmountsOut(
            "1000000000000000000",
            routeAddress
          );

          const marketPrice = ethers.utils.formatUnits(
            price[1].toString(),
            currencyB.decimals
          );
          const swapPrice = amountIn / fromAmount;
          const priceDifference = swapPrice - parseFloat(marketPrice);
          const priceImpact = (priceDifference / parseFloat(marketPrice)) * 100;
          setPriceImpact(priceImpact.toFixed(2));
        } catch (e) {
          setPriceImpact("");
        }
      } else if (routeAddress.length === 3) {
        try {
          const price1 = await rout.getAmountsOut("1000000000000000000", [
            routeAddress[0],
            routeAddress[1],
          ]);

          const price1String = price1.toString().split(",");

          const price2 = await rout.getAmountsOut(price1String[1], [
            routeAddress[1],
            routeAddress[2],
          ]);

          const marketPrice = ethers.utils.formatUnits(
            price2[1].toString(),
            currencyB.decimals
          );
          const swapPrice = amountIn / fromAmount;
          const priceDifference = swapPrice - parseFloat(marketPrice);
          const priceImpact = (priceDifference / parseFloat(marketPrice)) * 100;
          setPriceImpact(priceImpact.toFixed(2));
        } catch (e) {
          setPriceImpact("");
        }
      } else if (routeAddress.length === 4) {
        try {
          const price1 = await rout.getAmountsOut("1000000000000000000", [
            routeAddress[0],
            routeAddress[1],
          ]);

          const price1String = price1.toString().split(",");

          const price2 = await rout.getAmountsOut(price1String[1], [
            routeAddress[1],
            routeAddress[2],
          ]);

          const price2String = price2.toString().split(",");

          const price3 = await rout.getAmountsOut(price2String[1], [
            routeAddress[2],
            routeAddress[3],
          ]);

          const marketPrice = ethers.utils.formatUnits(
            price3[1].toString(),
            currencyB.decimals
          );
          const swapPrice = amountIn / fromAmount;
          const priceDifference = swapPrice - parseFloat(marketPrice);
          const priceImpact = (priceDifference / parseFloat(marketPrice)) * 100;
          setPriceImpact(priceImpact.toFixed(2));
        } catch (e) {
          setPriceImpact("");
        }
      } else {
        setPriceImpact("");
      }
    }
  }, [chainId, routeAddress, amountIn, fromAmount]);
  return { priceImpact };
};
