import React, { useMemo, useState } from 'react';
import { SmartSwapRouter } from '../utils/Contracts';
import { SMARTSWAPROUTER } from '../utils/addresses';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

export const useCalculatePriceImpact = (
  routeAddress: any,
  amountIn: number,
  fromAmount: number
) => {
  const { account, chainId } = useWeb3React();
  const [priceImpact, setPriceImpact] = useState('');

  useMemo(async () => {
    if (routeAddress && amountIn && fromAmount) {
      const rout = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
      if (routeAddress.length === 2) {
        try {
          const price = await rout.getAmountsOut(
            '1000000000000000000',
            routeAddress
          );

          const marketPrice = ethers.utils.formatEther(price[1].toString());
          const swapPrice = amountIn / fromAmount;
          const priceDifference = swapPrice - parseFloat(marketPrice);
          const priceImpact = (priceDifference / parseFloat(marketPrice)) * 100;
          setPriceImpact(priceImpact.toFixed(2));
        } catch (e) {
          setPriceImpact('');
        }
      } else if (routeAddress.length === 3) {
        try {
          const price1 = await rout.getAmountsOut('1000000000000000000', [
            routeAddress[0],
            routeAddress[1],
          ]);

          const price1String = price1.toString().split(',');

          const price2 = await rout.getAmountsOut(price1String[1], [
            routeAddress[1],
            routeAddress[2],
          ]);

          const marketPrice = ethers.utils.formatEther(price2[1].toString());
          const swapPrice = amountIn / fromAmount;
          const priceDifference = swapPrice - parseFloat(marketPrice);
          const priceImpact = (priceDifference / parseFloat(marketPrice)) * 100;
          setPriceImpact(priceImpact.toFixed(2));
        } catch (e) {
          setPriceImpact('');
        }
      } else if (routeAddress.length === 4) {
        try {
          const price1 = await rout.getAmountsOut('1000000000000000000', [
            routeAddress[0],
            routeAddress[1],
          ]);

          const price1String = price1.toString().split(',');

          const price2 = await rout.getAmountsOut(price1String[1], [
            routeAddress[1],
            routeAddress[2],
          ]);

          const price2String = price2.toString().split(',');

          const price3 = await rout.getAmountsOut(price2String[1], [
            routeAddress[2],
            routeAddress[3],
          ]);

          const marketPrice = ethers.utils.formatEther(price3[1].toString());
          const swapPrice = amountIn / fromAmount;
          const priceDifference = swapPrice - parseFloat(marketPrice);
          const priceImpact = (priceDifference / parseFloat(marketPrice)) * 100;
          setPriceImpact(priceImpact.toFixed(2));
        } catch (e) {
          setPriceImpact('');
        }
      } else {
        setPriceImpact('');
      }
    }
  }, [chainId, routeAddress, amountIn, fromAmount]);
  return { priceImpact };
};
