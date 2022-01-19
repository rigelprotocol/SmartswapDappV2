import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { smartSwapLPTokenPoolOne } from "../../utils/Contracts";
import { SMARTSWAPLP_TOKEN1ADDRESSES } from "../../utils/addresses";

export const useRGPPrice = () => {
  const { chainId } = useWeb3React();
  const [RGPPrice, setRGPPrice] = useState<string>(0);

  useEffect(() => {
    const getRGPprice = async () => {
      try {
        const RGPBUSDToken = await smartSwapLPTokenPoolOne(SMARTSWAPLP_TOKEN1ADDRESSES[chainId as number]);
        const reserves = await RGPBUSDToken.getReserves();
        setRGPPrice(ethers.utils.formatUnits(reserves[0].mul(10000).div(reserves[1]), 4));
      } catch (error) {
        setRGPPrice(0);
        console.log(error)
      }
    };
    getRGPprice();
  }, [chainId]);
  return [RGPPrice];
}
