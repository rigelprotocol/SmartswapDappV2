import { useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  LiquidityPairInstance,
  MasterChefV2Contract,
  smartFactory,
  SmartSwapRouter,
} from "../Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  SMARTSWAPROUTER,
  SMARTSWAPFACTORYADDRESSES,
  RGPADDRESSES,
  WNATIVEADDRESSES,
} from "../addresses";
import { Contract, ethers } from "ethers";
import BigNumber from "bignumber.js";

export const useGetFarmData = () => {
  const { chainId, account, library } = useWeb3React();

  const getLpfarmAddresses = async (farmLength: string, contract: Contract) => {
    const length = parseInt(farmLength);
    const LPAddress = [];

    for (let i = 0; i < length; i++) {
      const Lp = await contract.poolInfo(i);
      const LpAddress = Lp.lpToken;
      LPAddress.push(LpAddress);
    }
    return LPAddress;
  };

  const calculateRigelPrice = async () => {
    try {
      const rgp = "1000000000000000000";
      const pair = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number],
        library
      );
      const pairAddress = await pair.getPair(
        RGPADDRESSES[chainId as number],
        WNATIVEADDRESSES[chainId as number]
      );
      const LpTokenContract = await LiquidityPairInstance(pairAddress, library);
      const token0 = await LpTokenContract.token0();
      const token1 = await LpTokenContract.token1();
      const reserves = await LpTokenContract.getReserves();
      const router = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      const price = await router.quote(
        rgp,
        token0 === RGPADDRESSES[chainId as number]
          ? reserves[0].toString()
          : reserves[1].toString(),
        token0 === RGPADDRESSES[chainId as number]
          ? reserves[1].toString()
          : reserves[0].toString()
      );
      const formattedPrice = ethers.utils.formatEther(price.toString());
      return formattedPrice;
    } catch (err) {
      console.log(err);
    }
  };

  const getLpTokenReserve = async (address: string) => {
    try {
      const LpTokenContract = await LiquidityPairInstance(address, library);
      const totalReserves = await LpTokenContract.getReserves();
      return [
        ethers.utils.formatEther(totalReserves[0].toString()),
        ethers.utils.formatEther(totalReserves[1].toString()),
      ];
    } catch (err) {
      console.log(err);
    }
  };

  const getLpTokenTotalSupply = async (address: string) => {
    try {
      const LpTokenContract = await LiquidityPairInstance(address, library);
      const totalSupply = await LpTokenContract.totalSupply();
      return ethers.utils.formatEther(totalSupply.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const calculateLpTokenPrice = async () => {
    let rewardTokenPrice;

    rewardTokenPrice = await calculateRigelPrice();

    const tokenPriceCumulative = new BigNumber(
      1 * parseFloat(rewardTokenPrice as string)
    ).sqrt();

    const totalReserve = await getLpTokenReserve(
      "0x9218BFB996A9385C3b9633f87e9D68304Ef5a1e5"
    );

    const tokenReserveCumulative = new BigNumber(parseFloat(totalReserve[0]))
      .times(parseFloat(totalReserve[1]))
      .sqrt();

    const totalSupply = await getLpTokenTotalSupply(
      "0x9218BFB996A9385C3b9633f87e9D68304Ef5a1e5"
    );

    const lpTokenPrice = tokenReserveCumulative
      .times(tokenPriceCumulative)
      .times(2)
      .div(totalSupply);

    return lpTokenPrice.isNaN() || !lpTokenPrice.isFinite()
      ? 0
      : lpTokenPrice.toNumber();
  };

  const calculateAPY = async () => {
    try {
      const BLOCKS_PER_YEAR = 29000 * 365;
      let rewardTokenPrice;

      rewardTokenPrice = await calculateRigelPrice();

      const RIGEL_PER_BLOCK = ethers.utils.formatEther("164367816100000000");

      const totalRewardPricePerYear = new BigNumber(rewardTokenPrice as string)
        .times(RIGEL_PER_BLOCK)
        .times(BLOCKS_PER_YEAR);

      const Lpdposit = ethers.utils.formatEther("889064178683307019711");

      const lpPrice = await calculateLpTokenPrice();

      const totalPriceOfLpTokensInFarmingContract = new BigNumber(
        lpPrice
      ).times(Lpdposit);

      const apy = totalRewardPricePerYear
        .div(totalPriceOfLpTokensInFarmingContract)
        .times(100);

      console.log("apy", apy.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  useMemo(async () => {
    if (account) {
      try {
        const masterchef = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );

        // const farmLength = await masterchef.poolLength();
        // const LpAddress = await getLpfarmAddresses(farmLength, masterchef);
        // calculateRigelPrice();
        await calculateAPY();

        // console.log("farmLength", LpAddress);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
};
