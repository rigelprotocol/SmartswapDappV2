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
  updateChainId,
  updateFarms,
  updateLoadingState,
  updateSpecialPool,
} from "../../state/newfarm/actions";

export const useGetFarmData = (reload?: boolean, setReload?: any) => {
  const { chainId, account, library } = useWeb3React();
  const [loadingState, setLoading] = useState(true);
  const [farmdata, setFarmData] = useState<
    Array<{
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
    }>
  >([]);

  const dispatch = useDispatch();

  const handleUpdateFarms = useCallback(
    (value) => {
      dispatch(updateFarms({ value }));
    },
    [dispatch]
  );

  const handleUpdateChainId = useCallback(
    (value) => {
      dispatch(updateChainId({ value }));
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

  const calculateLiquidityandApy = async (
    address: string,
    rgpPrice: number | undefined,
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
      // const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
      //   await Promise.all([
      //     masterchef.pendingRigel(pid, account),
      //     masterchef.userInfo(pid, account),
      //     LPInstance.balanceOf(account),
      //     LPInstance.allowance(
      //       account,
      //       MASTERCHEFV2ADDRESSES[chainId as number]
      //     ),
      //   ]);
      // const tokenStaked = await userInfo.amount;

      return {
        id: pid,
        img: "rgp.svg",
        deposit: `${await formatSymbol(symbol0)}-${await formatSymbol(
          symbol1
        )}`,
        symbol0: await formatSymbol(symbol0),
        symbol1: await formatSymbol(symbol1),
        earn: "RGP",
        type: "LP",
        totalLiquidity,
        APY,
        allocPoint: parseFloat(allocPoint.toString()),
        // tokenStaked: [
        //   `${await formatSymbol(symbol0)}-${await formatSymbol(symbol1)}`,
        //   ethers.utils.formatEther(tokenStaked.toString()),
        // ],
        // RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
        // availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
        // poolAllowance: ethers.utils.formatEther(allowance.toString()),
        address: address,
      };
    } catch (err) {
      console.log(err);
    }
  };

  // const calculateLiquidityAndApy = async (
  //   address: string,
  //   pid?: number,
  //   reward?: number,
  //   Lp?: boolean
  // ) => {
  //   try {
  //     const masterchef = await MasterChefV2Contract(
  //       MASTERCHEFV2ADDRESSES[chainId as number],
  //       library
  //     );
  //     const LPInstance = await LiquidityPairInstance(address, library);
  //     const reserves = await getLpTokenReserve(address);
  //     const totalRGP = reserves
  //       ? RGPADDRESSES[chainId as number] === reserves.tokenAddress0
  //         ? reserves.reserves0.toString()
  //         : reserves.reserves1.toString()
  //       : "1";

  //     const totalStable = reserves
  //       ? BUSD[chainId as number] === reserves.tokenAddress0 ||
  //         USDT[chainId as number] === reserves.tokenAddress0 ||
  //         USDC[chainId as number] === reserves.tokenAddress0
  //         ? ethers.utils.formatUnits(
  //             reserves.reserves0.toString(),
  //             reserves.decimals0
  //           )
  //         : ethers.utils.formatUnits(
  //             reserves.reserves1.toString(),
  //             reserves.decimals1
  //           )
  //       : "1";
  //     const rgpPrice = await calculateRigelPrice();
  //     const [token0, token1] = await Promise.all([
  //       getERC20Token(reserves && reserves.tokenAddress0, library),
  //       getERC20Token(reserves && reserves.tokenAddress1, library),
  //     ]);

  //     const [symbol0, symbol1] = await Promise.all([
  //       token0.symbol(),
  //       token1.symbol(),
  //     ]);

  //     const totalLiquidity =
  //       symbol0 === "BUSD" ||
  //       symbol1 === "BUSD" ||
  //       symbol0 === "USDT" ||
  //       symbol1 === "USDT" ||
  //       symbol0 === "USDC" ||
  //       symbol1 === "USDC"
  //         ? parseFloat(totalStable) * 2
  //         : parseFloat(ethers.utils.formatEther(totalRGP)) * rgpPrice * 2;

  //     const [poolInfo, totalAllocPoint] = await Promise.all([
  //       masterchef.poolInfo(pid),
  //       masterchef.totalAllocPoint(),
  //     ]);
  //     const allocPoint = await poolInfo.allocPoint;
  //     const poolReward =
  //       (parseFloat(allocPoint.toString()) /
  //         parseFloat(totalAllocPoint.toString())) *
  //       reward;
  //     const APY = (rgpPrice * poolReward * 365 * 100) / totalLiquidity;
  //     const [tokenEarned, userInfo, FarmTokenBalance, allowance] =
  //       await Promise.all([
  //         masterchef.pendingRigel(pid, account),
  //         masterchef.userInfo(pid, account),
  //         LPInstance.balanceOf(account),
  //         LPInstance.allowance(
  //           account,
  //           MASTERCHEFV2ADDRESSES[chainId as number]
  //         ),
  //       ]);
  //     const tokenStaked = await userInfo.amount;

  //     return {
  //       id: pid,
  //       img: "rgp.svg",
  //       deposit: `${await formatSymbol(symbol0)}-${await formatSymbol(
  //         symbol1
  //       )}`,
  //       earn: "RGP",
  //       type: "LP",
  //       totalLiquidity,
  //       APY,
  //       tokenStaked: [
  //         `${await formatSymbol(symbol0)}-${await formatSymbol(symbol1)}`,
  //         ethers.utils.formatEther(tokenStaked.toString()),
  //       ],
  //       RGPEarned: ethers.utils.formatEther(tokenEarned.toString()),
  //       availableToken: ethers.utils.formatEther(FarmTokenBalance.toString()),
  //       poolAllowance: ethers.utils.formatEther(allowance.toString()),
  //       address: address,
  //     };
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const loopFarms = async (LpAddress: any[], rgpPrice: number | undefined) => {
    const data = [];

    for (let i = 0; i < LpAddress.length; i++) {
      const farm = await calculateLiquidityandApy(
        LpAddress[i],
        rgpPrice,
        i,
        chainId === 137 || chainId === 80001
          ? 2014.83125
          : chainId === 56 || chainId === 97
          ? 4300
          : chainId === 42262 || chainId === 42261
          ? 1343.220833
          : undefined
      );
      data.push(farm);
    }

    const iterated = data.filter(
      (item) => item?.allocPoint !== 0 && item !== undefined
    );


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
        const rgpPrice = await calculateRigelPrice();

        const farmLength = await masterchef.poolLength();
        const LpAddress = await getLpfarmAddresses(farmLength, masterchef);
        const farms = await loopFarms(LpAddress, rgpPrice);

        setLoading(false);


        handleLoading(false);
        handleUpdateChainId(chainId);

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
