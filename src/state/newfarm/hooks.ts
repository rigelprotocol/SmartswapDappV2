import { State } from "../types";
import { farmDataInterface } from "./reducer";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateAllowance } from "./actions";
import { useWeb3React } from "@web3-react/core";
import { useGetFarmData } from "../../utils/hooks/useGetFarmData";
import { id } from "ethers/lib/utils";
import {
  MasterChefV2Contract,
  LiquidityPairInstance,
  smartFactory,
  productStakingContract,
  RGPSpecialPool2,
} from "../../utils/Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  SMARTSWAPFACTORYADDRESSES,
  RGPADDRESSES,
  BUSD,
  USDT,
  USDC,
  PRODUCTSTAKINGADDRESSES,
  RGPSPECIALPOOLADDRESSES2,
} from "../../utils/addresses";
import { getERC20Token } from "../../utils/utilsFunctions";
import { ethers } from "ethers";
import { updateFarms } from "./actions";
import {
  updateFilterResult,
  updateSearchResult,
  updateYieldFarmDetails,
  updateNewFilterResult,
  updateNewSearchResult,
  updateProductFarmDetails,
} from "../farming/action";
import Web3 from "web3";
import {
  updateQuickSwapFarm,
  updateLpFarm,
  updateStableFarm,
  updateSpecialPool,
} from "../farm/actions";
import farm from "../farm";

export const useFarmData = (content: any): farmDataInterface => {
  const farms = useSelector((state: State) => state.farms);
  const farm =
    content?.farm === "lp"
      ? farms.LpFarm
      : content?.farm === "quick"
      ? farms.QuickswapFarm
      : content?.farm === "stable"
      ? farms.StableFarm
      : content?.farm === "special"
      ? farms.SpecialPool
      : null;

  return farm;
};

interface updateFarmInterface {
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  content: {
    id: number | undefined;
    img: string;
    deposit: string;
    symbol0: string;
    symbol1: string;
    earn: string;
    type: string;
    totalLiquidity: number;
    APY: number;
    address: string;
  };
  section: string;
  address: string;
}

export const useUpdateFarm = ({
  reload,
  setReload,
  content,
  section,
  address,
}: updateFarmInterface) => {
  const data = useFarmData(content);
  const searchSection = useSelector((state) => state.farming);

  const { account, chainId, library } = useWeb3React();
  const [loadingState, setLoadingState] = useState(false);

  const dispatch = useDispatch();

  const handleUpdateFarms = useCallback(
    (value) => {
      dispatch(
        content?.farm === "lp"
          ? updateLpFarm(value)
          : content?.farm === "quick"
          ? updateQuickSwapFarm(value)
          : content?.farm === "stable"
          ? updateStableFarm(value)
          : content?.farm === "special"
          ? updateSpecialPool(value)
          : null
      );
    },
    [dispatch]
  );

  const calculateRigelPrice = async () => {
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

  const calculateLiquidityAndApy = async (reward: number | undefined) => {
    try {
      if (content?.farm === "special") {
        const specialPool = await RGPSpecialPool2(content?.address, library);

        const token = await getERC20Token(
          RGPADDRESSES[chainId as number],
          library
        );

        const [amountStaked, allowance, balance] = await Promise.all([
          specialPool.userInfo(account),
          token.allowance(account, RGPSPECIALPOOLADDRESSES2[chainId as number]),
          token.balanceOf(account),
        ]);

        return {
          id: content?.id,
          img: "rgp.svg",
          // deposit: 'RGP',
          deposit: "RGP",
          earn: "RGP",
          type: "RGP",
          ARYValue: content?.ARYValue,
          totalLiquidity: content?.totalLiquidity,
          tokensStaked: [
            "RGP",
            parseFloat(
              ethers.utils.formatEther(amountStaked?._amountStaked.toString())
            ),
          ],
          RGPEarned: parseFloat(
            ethers.utils.formatEther(amountStaked?._userReward.toString())
          ),
          availableToken: parseFloat(
            ethers.utils.formatEther(balance.toString())
          ),
          inflationPerDay: 0,
          tokenPrice: content?.rgpPrice,
          totalVolumePerPool: 0,
          farmingFee: 0,
          pId: content?.pId,
          poolAllowance: parseFloat(
            ethers.utils.formatEther(allowance.toString())
          ),
          poolVersion: content?.poolVersion,
          version: content?.version,
          farm: "special",
          address: content?.address,
        };
      } else {
        const masterchef = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const LPInstance = await LiquidityPairInstance(
          content.address,
          library
        );
        const reserves = await getLpTokenReserve(content.address);
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

        const totalRGP = reserves
          ? RGPADDRESSES[chainId as number] === reserves.tokenAddress0
            ? reserves.reserves0.toString()
            : reserves.reserves1.toString()
          : "1";

        const totalLiquidity =
          symbol0 === "BUSD" ||
          symbol1 === "BUSD" ||
          symbol0 === "USDT" ||
          symbol1 === "USDT" ||
          symbol0 === "USDC" ||
          symbol1 === "USDC"
            ? parseFloat(totalStable) * 2
            : parseFloat(ethers.utils.formatEther(totalRGP)) * rgpPrice * 2;

        const [poolInfo, totalAllocPoint] = await Promise.all([
          masterchef.poolInfo(content.id),
          masterchef.totalAllocPoint(),
        ]);
        const allocPoint = await poolInfo.allocPoint;
        const poolReward =
          (parseFloat(allocPoint.toString()) /
            parseFloat(totalAllocPoint.toString())) *
          reward;
        const APY = (rgpPrice * poolReward * 365 * 100) / totalLiquidity;
        const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
          await Promise.all([
            masterchef.pendingRigel(content.id, account),
            masterchef.userInfo(content.id, account),
            LPInstance.balanceOf(account),
            LPInstance.allowance(
              account,
              MASTERCHEFV2ADDRESSES[chainId as number]
            ),
          ]);
        const tokenStaked = await userInfo.amount;

        return {
          id: content.id,
          img: "rgp.svg",
          deposit: content.deposit,
          earn: "RGP",
          type: "LP",
          totalLiquidity,
          APY,
          tokenStaked: [
            `${content.symbol0}-${content.symbol1}`,
            ethers.utils.formatEther(tokenStaked.toString()),
          ],
          RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
          availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
          poolAllowance: ethers.utils.formatEther(allowance.toString()),
          address: content.address,
          farm: content?.farm,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
  useMemo(async () => {
    if (data !== undefined && account) {
      if (reload) {
        setLoadingState(true);
        let newArray = [...data];

        const updatedFarm = await calculateLiquidityAndApy(
          chainId === 137 || chainId === 80001
            ? 2014.83125
            : chainId === 56 || chainId === 97
            ? 4300
            : chainId === 42262 || chainId === 42261
            ? 1343.220833
            : undefined
        );
        const index = newArray.findIndex((item) => item.id === content.id);
        newArray[index] = updatedFarm;
        handleUpdateFarms(newArray);

        setLoadingState(false);
        setReload(false);
      }
    }
  }, [reload]);
  return { loadingState };
};

interface FetchYieldFarmDetails {
  content: {
    id: number | undefined;
    img: string;
    deposit: string;
    symbol0: string;
    symbol1: string;
    earn: string;
    type: string;
    totalLiquidity: number;
    APY: number;
    address: string;
  };
  section: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
}

export const useFetchYieldFarmDetails = ({
  content,
  section,
  loading,
  setLoading,
  reload,
}: FetchYieldFarmDetails) => {
  const data = useFarmData(content);
  const searchSection = useSelector((state) => state.farming);
  const { account, chainId, library } = useWeb3React();
  // const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const handleUpdateFarms = useCallback(
    (value) => {
      dispatch(
        content?.farm === "lp"
          ? updateLpFarm(value)
          : content?.farm === "quick"
          ? updateQuickSwapFarm(value)
          : content?.farm === "stable"
          ? updateStableFarm(value)
          : content?.farm === "special"
          ? updateSpecialPool(value)
          : null
      );
    },
    [dispatch]
  );

  const calculateRigelPrice = async () => {
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

  const calculateLiquidityAndApy = async (reward: number | undefined) => {
    try {
      if (content?.farm === "special") {
        const specialPool = await RGPSpecialPool2(content?.address, library);

        const token = await getERC20Token(
          RGPADDRESSES[chainId as number],
          library
        );

        const [amountStaked, allowance, balance] = await Promise.all([
          specialPool.userInfo(account),
          token.allowance(account, RGPSPECIALPOOLADDRESSES2[chainId as number]),
          token.balanceOf(account),
        ]);

        return {
          id: content?.id,
          img: "rgp.svg",
          // deposit: 'RGP',
          deposit: "RGP",
          earn: "RGP",
          type: "RGP",
          ARYValue: content?.ARYValue,
          totalLiquidity: content?.totalLiquidity,
          tokensStaked: [
            "RGP",
            parseFloat(
              ethers.utils.formatEther(amountStaked?._amountStaked.toString())
            ),
          ],
          RGPEarned: parseFloat(
            ethers.utils.formatEther(amountStaked?._userReward.toString())
          ),
          availableToken: parseFloat(
            ethers.utils.formatEther(balance.toString())
          ),
          inflationPerDay: 0,
          tokenPrice: content?.rgpPrice,
          totalVolumePerPool: 0,
          farmingFee: 0,
          pId: content?.pId,
          poolAllowance: parseFloat(
            ethers.utils.formatEther(allowance.toString())
          ),
          poolVersion: content?.poolVersion,
          version: content?.version,
          farm: "special",
          address: content?.address,
        };
      } else {
        const masterchef = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[chainId as number],
          library
        );
        const LPInstance = await LiquidityPairInstance(
          content.address,
          library
        );
        const reserves = await getLpTokenReserve(content.address);
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

        const totalRGP = reserves
          ? RGPADDRESSES[chainId as number] === reserves.tokenAddress0
            ? reserves.reserves0.toString()
            : reserves.reserves1.toString()
          : "1";

        const totalLiquidity =
          symbol0 === "BUSD" ||
          symbol1 === "BUSD" ||
          symbol0 === "USDT" ||
          symbol1 === "USDT" ||
          symbol0 === "USDC" ||
          symbol1 === "USDC"
            ? parseFloat(totalStable) * 2
            : parseFloat(ethers.utils.formatEther(totalRGP)) * rgpPrice * 2;

        const [poolInfo, totalAllocPoint] = await Promise.all([
          masterchef.poolInfo(content.id),
          masterchef.totalAllocPoint(),
        ]);
        const allocPoint = await poolInfo.allocPoint;
        const poolReward =
          (parseFloat(allocPoint.toString()) /
            parseFloat(totalAllocPoint.toString())) *
          reward;
        const APY = (rgpPrice * poolReward * 365 * 100) / totalLiquidity;
        const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
          await Promise.all([
            masterchef.pendingRigel(content.id, account),
            masterchef.userInfo(content.id, account),
            LPInstance.balanceOf(account),
            LPInstance.allowance(
              account,
              MASTERCHEFV2ADDRESSES[chainId as number]
            ),
          ]);
        const tokenStaked = await userInfo.amount;

        return {
          id: content.id,
          img: "rgp.svg",
          deposit: content.deposit,
          earn: "RGP",
          type: "LP",
          totalLiquidity,
          APY,
          tokenStaked: [
            `${content.symbol0}-${content.symbol1}`,
            ethers.utils.formatEther(tokenStaked.toString()),
          ],
          RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
          availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
          poolAllowance: ethers.utils.formatEther(allowance.toString()),
          address: content.address,
          farm: content?.farm,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };

  useMemo(async () => {
    if (data !== undefined && account) {
      setLoading(true);
      let newArray = [...data];

      const updatedFarm = await calculateLiquidityAndApy(
        chainId === 137 || chainId === 80001
          ? 2014.83125
          : chainId === 56 || chainId === 97
          ? 4300
          : chainId === 42262 || chainId === 42261
          ? 1343.220833
          : undefined
      );

      const index = newArray.findIndex((item) => item.id === content.id);

      newArray[index] = updatedFarm;

      console.log("updatedd", newArray);

      handleUpdateFarms(newArray);

      setLoading(false);
    }
  }, [reload]);
  return { loading };
};

interface productFarmState {
  content: {
    feature: string;
    percentageProfitShare: string;
    profitTimeLine: string;
    totalLiquidity: string;
    estimatedTotalProfit: string;
    pid: number;
    deposit: string;
    poolAllowance: "";
    type: string;
  };
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const useProductFarmDetails = ({
  content,
  loading,
  setLoading,
}: productFarmState) => {
  const { account, chainId, library } = useWeb3React();
  const getUserValue = async () => {
    const productFarm = await productStakingContract(
      PRODUCTSTAKINGADDRESSES[chainId as number],
      library
    );
    const [userInfo, FarmTokenBalance] = await Promise.all([
      productFarm.userInfo(account),
      productFarm.userData(account),
    ]);
    const tokenStaked = await FarmTokenBalance.tokenQuantity;
    console.log(
      { tokenStaked },
      tokenStaked.toString(),
      Web3.utils.fromWei(tokenStaked.toString())
    );

    return {
      feature: "AutoTrade",
      percentageProfitShare: "25%",
      profitTimeLine: "6 months",
      totalLiquidity: "188839",
      estimatedTotalProfit: "929020003",
      deposit: "RGP",
      pid: 93903,
      poolAllowance: "",
      type: "AT",
      tokenStaked: Web3.utils.fromWei(tokenStaked.toString()),
    };
  };

  useMemo(async () => {
    let response = await getUserValue();

    updateProductFarmDetails({ value: [response] });

    setLoading(false);
  }, []);
  return { loading };
};
export const useUpdateProductFarm = ({
  reload,
  setReload,
  content,
  section,
}: updateFarmInterface) => {
  const data = useFarmData(content);
  const searchSection = useSelector((state) => state.farming);

  const { account, chainId, library } = useWeb3React();
  const [loadingState, setLoadingState] = useState(true);

  const dispatch = useDispatch();

  return { loadingState };
};

// const { account, chainId, library } = useWeb3React();

// const dispatch = useDispatch();
