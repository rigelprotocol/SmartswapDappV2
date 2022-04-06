import { useMemo, useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  LiquidityPairInstance,
  MasterChefV2Contract,
  RGPSpecialPool2,
  smartFactory,
  SmartSwapRouter,
} from "../Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  SMARTSWAPROUTER,
  SMARTSWAPFACTORYADDRESSES,
  RGPADDRESSES,
  WNATIVEADDRESSES,
  BUSD,
  USDT,
  USDC,
  RGPSPECIALPOOLADDRESSES,
  RGPSPECIALPOOLADDRESSES2,
} from "../addresses";
import { Contract, ethers } from "ethers";
import BigNumber from "bignumber.js";
import { JSBI } from "@uniswap/sdk";
import { getERC20Token } from "../utilsFunctions";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFarms,
  updateLoadingState,
  updateSpecialPool,
} from "../../state/newfarm/actions";

export const useGetFarmData = (reload?: boolean, setReload?: any) => {
  const { chainId, account, library } = useWeb3React();
  const [loadingState, setLoading] = useState(false);
  const [farmdata, setFarmData] = useState<
    Array<{
      id: number;
      img: string;
      deposit: string;
      earn: string;
      type: string;
      totalLiquidity: number;
      APY: number;
      tokenStaked: string[];
      RGPEarned: string;
      availableToken: string;
      allowance: string;
      address: string;
    }>
  >([]);

  const dispatch = useDispatch();

  const handleUpdateFarms = useCallback(
    (value) => {
      dispatch(updateFarms({ value }));
    },
    [dispatch]
  );

  const handleUpdateSpecialPool = useCallback(
    (value) => {
      dispatch(updateSpecialPool({ value }));
    },
    [dispatch]
  );

  const handleLoading = useCallback(
    (value) => {
      dispatch(updateLoadingState({ value }));
    },
    [dispatch]
  );

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
    //this function calculates the price of RGP in BNB
    try {
      let rgpPrice;
      const pair = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number],
        library
      );

      if (chainId === 56 || chainId === 97) {
        const pairAddress = await pair.getPair(
          RGPADDRESSES[chainId as number],
          BUSD[chainId as number]
        );
        const LpTokenContract = await LiquidityPairInstance(
          pairAddress,
          library
        );
        const token0Address = await LpTokenContract.token0();
        const token1Address = await LpTokenContract.token1();

        const [token0Contract, token1Contract] = await Promise.all([
          getERC20Token(token0Address, library),
          getERC20Token(token1Address, library),
        ]);

        const [decimal0, decimal1] = await Promise.all([
          token0Contract.decimals(),
          token1Contract.decimals(),
        ]);

        const reserves = await LpTokenContract.getReserves();
        const totalBUSD: number | any = ethers.utils.formatUnits(
          token0Address === BUSD[chainId as number] ? reserves[0] : reserves[1],
          token0Address === BUSD[chainId as number] ? decimal0 : decimal1
        );

        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address === BUSD[chainId as number] ? reserves[1] : reserves[0],
          token0Address === BUSD[chainId as number] ? decimal1 : decimal0
        );

        rgpPrice = totalBUSD / totalRGP;
        console.log("second", totalBUSD / totalRGP);
      } else {
        const pairAddress = await pair.getPair(
          RGPADDRESSES[chainId as number],
          USDT[chainId as number]
        );
        const LpTokenContract = await LiquidityPairInstance(
          pairAddress,
          library
        );
        const token0Address = await LpTokenContract.token0();
        const token1Address = await LpTokenContract.token1();
        const [token0Contract, token1Contract] = await Promise.all([
          getERC20Token(token0Address, library),
          getERC20Token(token1Address, library),
        ]);
        const [symbol0, symbol1] = await Promise.all([
          token0Contract.symbol(),
          token1Contract.symbol(),
        ]);

        const [decimal0, decimal1] = await Promise.all([
          token0Contract.decimals(),
          token1Contract.decimals(),
        ]);
        const reserves = await LpTokenContract.getReserves();
        const totalUSDT: number | any = ethers.utils.formatUnits(
          token0Address === USDT[chainId as number] ? reserves[0] : reserves[1],
          token0Address === USDT[chainId as number] ? decimal0 : decimal1
        );
        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address === USDT[chainId as number] ? reserves[1] : reserves[0],
          token0Address === USDT[chainId as number] ? decimal1 : decimal0
        );
        rgpPrice = totalUSDT / totalRGP;
        console.log("second", totalUSDT / totalRGP);

        console.log(reserves[0].toString(), reserves[1].toString());
      }

      return rgpPrice;
    } catch (err) {
      console.log(err);
    }
  };

  const getLpTokenReserve = async (address: string) => {
    //this function gets the reserves of an LP token, it takes the LP token address as an argument
    try {
      const LpTokenContract = await LiquidityPairInstance(address, library);
      const [totalReserves, token0, token1] = await Promise.all([
        LpTokenContract.getReserves(),
        LpTokenContract.token0(),
        LpTokenContract.token1(),
      ]);

      const [token0Contract, token1Contract] = await Promise.all([
        getERC20Token(token0, library),
        getERC20Token(token1, library),
      ]);
      const [symbol0, decimals0, symbol1, decimals1] = await Promise.all([
        token0Contract.symbol(),
        token0Contract.decimals(),
        token1Contract.symbol(),
        token1Contract.decimals(),
      ]);

      // const totalReserves = await LpTokenContract.getReserves();
      // const token0 = await LpTokenContract.token0();
      // const token1 = await LpTokenContract.token1();
      return {
        reserves0: totalReserves[0],
        reserves1: totalReserves[1],
        tokenAddress0: token0,
        tokenAddress1: token1,
        symbol0,
        symbol1,
        decimals0,
        decimals1,
      };
    } catch (err) {
      console.log(err);
    }
  };

  const formatSymbol = async (symbol: string) => {
    let formatted;
    if (symbol === "WMATIC") {
      formatted = "MATIC";
    } else if (symbol === "WBNB") {
      formatted = "BNB";
    } else if (symbol === "wROSE") {
      formatted = "ROSE";
    } else if (symbol === "WROSE") {
      formatted = "ROSE";
    } else {
      formatted = symbol;
    }

    return formatted;
  };

  const specialPoolStaked = async (address: string) => {
    if (account) {
      try {
        const specialPool = await RGPSpecialPool2(address, library);
        const [staked, earned] = await Promise.all([
          specialPool.userData(account),
          specialPool.calculateRewards(account),
        ]);
        return { staked, earned };
      } catch (error) {
        console.log(error);
      }
    }
  };

  const RGPBalance = async (address: string) => {
    const rgpContract = await getERC20Token(address, library);
    console.log("rgpcontract", rgpContract);
    const [balance, allowance] = await Promise.all([
      rgpContract.balanceOf(account),
      rgpContract.allowance(account, address),
    ]);
    return { balance, allowance };
  };

  const getSpecialPool = async (address: string, id: number) => {
    try {
      const specialPoolContract = await RGPSpecialPool2(address, library);
      const rgpTotalStaking = await specialPoolContract.totalStaking();

      const rgpPrice = await calculateRigelPrice();

      const totalStaking =
        parseFloat(ethers.utils.formatUnits(rgpTotalStaking.toString(), 18)) *
        rgpPrice;

      const { balance, allowance } = await RGPBalance(
        RGPADDRESSES[chainId as number]
      );
      const stakedData = await specialPoolStaked(address);

      return {
        id: id,
        img: "rgp.svg",
        deposit: `RGP`,
        earn: "RGP",
        type: "RGP",
        totalLiquidity: totalStaking,
        APY: 8.756,
        tokenStaked: [
          `RGP`,
          ethers.utils.formatEther(stakedData?.staked.tokenQuantity.toString()),
        ],
        RGPEarned: ethers.utils.formatEther(stakedData?.earned.toString()),
        availableToken: ethers.utils.formatEther(balance.toString()),
        allowance: ethers.utils.formatEther(allowance.toString()),
        address: address,
      };
    } catch (err) {
      console.log("special-error", err);
    }
  };

  const calculateLiquidityAndApy = async (
    address: string,
    pid?: number,
    reward?: number,
    Lp?: boolean
  ) => {
    try {
      const masterchef = await MasterChefV2Contract(
        MASTERCHEFV2ADDRESSES[chainId as number],
        library
      );
      const LPInstance = await LiquidityPairInstance(address, library);
      const reserves = await getLpTokenReserve(address);
      const totalRGP = reserves
        ? RGPADDRESSES[chainId as number] === reserves.tokenAddress0
          ? reserves.reserves0.toString()
          : reserves.reserves1.toString()
        : "1";

      const totalStable = reserves
        ? BUSD[chainId as number] === reserves.tokenAddress0 ||
          USDT[chainId as number] === reserves.tokenAddress0 ||
          USDC[chainId as number] === reserves.tokenAddress0
          ? ethers.utils.formatUnits(
              reserves.reserves0.toString(),
              reserves.decimals0
            )
          : ethers.utils.formatUnits(
              reserves.reserves1.toString(),
              reserves.decimals1
            )
        : "1";
      const rgpPrice = await calculateRigelPrice();
      const [token0, token1] = await Promise.all([
        getERC20Token(reserves && reserves.tokenAddress0, library),
        getERC20Token(reserves && reserves.tokenAddress1, library),
      ]);

      const [symbol0, symbol1] = await Promise.all([
        token0.symbol(),
        token1.symbol(),
      ]);

      const totalLiquidity =
        symbol0 === "BUSD" ||
        symbol1 === "BUSD" ||
        symbol0 === "USDT" ||
        symbol1 === "USDT" ||
        symbol0 === "USDC" ||
        symbol1 === "USDC"
          ? parseFloat(totalStable) * 2
          : parseFloat(ethers.utils.formatEther(totalRGP)) * rgpPrice * 2;
      // const poolInfo = await masterchef.poolInfo(pid);

      // const totalAllocPoint = await masterchef.totalAllocPoint();

      const [poolInfo, totalAllocPoint] = await Promise.all([
        masterchef.poolInfo(pid),
        masterchef.totalAllocPoint(),
      ]);
      const allocPoint = await poolInfo.allocPoint;
      const poolReward =
        (parseFloat(allocPoint.toString()) /
          parseFloat(totalAllocPoint.toString())) *
        reward;
      const APY = (rgpPrice * poolReward * 365 * 100) / totalLiquidity;

      // const tokenEarned = await masterchef.pendingRigel(pid, account);
      // const userInfo = await masterchef.userInfo(pid, account);
      const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
        await Promise.all([
          masterchef.pendingRigel(pid, account),
          masterchef.userInfo(pid, account),
          LPInstance.balanceOf(account),
          LPInstance.allowance(
            account,
            MASTERCHEFV2ADDRESSES[chainId as number]
          ),
        ]);
      const tokenStaked = await userInfo.amount;
      // const FarmTokenBalance = await LPInstance.balanceOf(account);

      return {
        id: pid,
        img: "rgp.svg",
        deposit: `${await formatSymbol(symbol0)}-${await formatSymbol(
          symbol1
        )}`,
        earn: "RGP",
        type: "LP",
        totalLiquidity,
        APY,
        tokenStaked: [
          `${await formatSymbol(symbol0)}-${await formatSymbol(symbol1)}`,
          ethers.utils.formatEther(tokenStaked.toString()),
        ],
        RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
        availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
        allowance: ethers.utils.formatEther(allowance.toString()),
        address: address,
      };
    } catch (err) {
      console.log(err);
    }
  };

  const loopFarms = async (LpAddress: any[]) => {
    const data = [];

    for (let i = 0; i < LpAddress.length; i++) {
      const farm = await calculateLiquidityAndApy(LpAddress[i], i, 4300);
      data.push(farm);
    }

    const iterated = data.filter((item) => item !== undefined);

    return iterated;
  };

  useMemo(async () => {
    if (account) {
      try {
        setLoading(true);
        handleLoading(true);
        const masterchef = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );

        const farmLength = await masterchef.poolLength();
        const LpAddress = await getLpfarmAddresses(farmLength, masterchef);
        const farms = await loopFarms(LpAddress);

        setLoading(false);
        const specialPool = await getSpecialPool(
          RGPSPECIALPOOLADDRESSES[chainId as number],
          100
        );
        const specialPoolV2 = await getSpecialPool(
          RGPSPECIALPOOLADDRESSES2[chainId as number],
          101
        );

        const farmWithSpecialPools = [];
        farmWithSpecialPools.push(specialPool, specialPoolV2);
        console.log(farmWithSpecialPools);
        handleLoading(false);
        handleUpdateSpecialPool(farmWithSpecialPools);
        handleUpdateFarms(farms);
        setFarmData(farms);
        setReload(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [chainId, reload]);

  return { farmdata, loadingState };
};
