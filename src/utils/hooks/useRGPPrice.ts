import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {smartSwapLPTokenPoolOne} from "../../utils/Contracts"

export const useRGPPrice = () => {
  const { chainId } = useWeb3React();
  const [RGPPrice, setRGPPrice] = useState<string>(0);

  useEffect(() => {
    const getRGPprice = async () => {
      try {
        const RGPBUSDToken = await smartSwapLPTokenPoolOne();
        const reserves = await RGPBUSDToken.getReserves();
        setRGPPrice(ethers.utils.formatUnits(reserves[0].mul(10000).div(reserves[1]), 4));
        console.log(RGPPrice)
      } catch (error) {
        setRGPPrice(0);
        console.log(error)
      }
    };
  }, [chainId]);
  return [RGPPrice];
}
