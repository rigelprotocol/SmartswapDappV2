import { useMemo, useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  LiquidityPairInstance,
  MasterChefV2Contract,
  RGPSpecialPool2,
  smartFactory,
} from "../Contracts";
import {
  MASTERCHEFV2ADDRESSES,
  SMARTSWAPFACTORYADDRESSES,
  RGPADDRESSES,
  BUSD,
  USDT,
  USDC,
  RGPSPECIALPOOLADDRESSES2,
} from "../addresses";
import { Contract, ethers } from "ethers";
import { getERC20Token, useProvider } from "../utilsFunctions";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChainId,
  updateFarms,
  updateLoadingState,
  updateSpecialPool,
} from "../../state/newfarm/actions";

import { RootState } from "../../state";
import { SupportedChainId } from "../../constants/chains";

export const useGetFarmData = (reload?: boolean, setReload?: any) => {
  const { library } = useWeb3React();
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
  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);
  const { prov } = useProvider();
  const lib = library ? library : prov;

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
        SMARTSWAPFACTORYADDRESSES[ChainId as number],
        lib
      );

      if (ChainId === 56 || ChainId === 97) {
        const pairAddress = await pair.getPair(
          RGPADDRESSES[ChainId as number],
          BUSD[ChainId as number]
        );
        const LpTokenContract = await LiquidityPairInstance(pairAddress, lib);
        const token0Address = await LpTokenContract.token0();
        const token1Address = await LpTokenContract.token1();

        const [token0Contract, token1Contract] = await Promise.all([
          getERC20Token(token0Address, lib),
          getERC20Token(token1Address, lib),
        ]);

        const [decimal0, decimal1] = await Promise.all([
          token0Contract.decimals(),
          token1Contract.decimals(),
        ]);

        const reserves = await LpTokenContract.getReserves();
        const totalBUSD: number | any = ethers.utils.formatUnits(
          token0Address === BUSD[ChainId as number] ? reserves[0] : reserves[1],
          token0Address === BUSD[ChainId as number] ? decimal0 : decimal1
        );

        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address === BUSD[ChainId as number] ? reserves[1] : reserves[0],
          token0Address === BUSD[ChainId as number] ? decimal1 : decimal0
        );

        rgpPrice = totalBUSD / totalRGP;
      } else {
        const pairAddress = await pair.getPair(
          RGPADDRESSES[ChainId as number],
          USDT[ChainId as number]
        );
        const LpTokenContract = await LiquidityPairInstance(pairAddress, lib);
        const token0Address = await LpTokenContract.token0();
        const token1Address = await LpTokenContract.token1();
        const [token0Contract, token1Contract] = await Promise.all([
          getERC20Token(token0Address, lib),
          getERC20Token(token1Address, lib),
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
          token0Address === USDT[ChainId as number] ? reserves[0] : reserves[1],
          token0Address === USDT[ChainId as number] ? decimal0 : decimal1
        );
        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address === USDT[ChainId as number] ? reserves[1] : reserves[0],
          token0Address === USDT[ChainId as number] ? decimal1 : decimal0
        );
        rgpPrice = totalUSDT / totalRGP;

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
      const LpTokenContract = await LiquidityPairInstance(address, lib);
      const [totalReserves, token0, token1] = await Promise.all([
        LpTokenContract.getReserves(),
        LpTokenContract.token0(),
        LpTokenContract.token1(),
      ]);

      const [token0Contract, token1Contract] = await Promise.all([
        getERC20Token(token0, lib),
        getERC20Token(token1, lib),
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
        MASTERCHEFV2ADDRESSES[ChainId as number],
        lib
      );
      const LPInstance = await LiquidityPairInstance(address, lib);
      const reserves = await getLpTokenReserve(address);
      const totalRGP = reserves
        ? RGPADDRESSES[ChainId as number] === reserves.tokenAddress0
          ? reserves.reserves0.toString()
          : reserves.reserves1.toString()
        : "1";

      const totalStable = reserves
        ? BUSD[ChainId as number] === reserves.tokenAddress0 ||
          USDT[ChainId as number] === reserves.tokenAddress0 ||
          USDC[ChainId as number] === reserves.tokenAddress0
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
        getERC20Token(reserves && reserves.tokenAddress0, lib),
        getERC20Token(reserves && reserves.tokenAddress1, lib),
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
      //       MASTERCHEFV2ADDRESSES[ChainId as number]
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
  //       MASTERCHEFV2ADDRESSES[ChainId as number],
  //       lib
  //     );
  //     const LPInstance = await LiquidityPairInstance(address, lib);
  //     const reserves = await getLpTokenReserve(address);
  //     const totalRGP = reserves
  //       ? RGPADDRESSES[ChainId as number] === reserves.tokenAddress0
  //         ? reserves.reserves0.toString()
  //         : reserves.reserves1.toString()
  //       : "1";

  //     const totalStable = reserves
  //       ? BUSD[ChainId as number] === reserves.tokenAddress0 ||
  //         USDT[ChainId as number] === reserves.tokenAddress0 ||
  //         USDC[ChainId as number] === reserves.tokenAddress0
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
  //       getERC20Token(reserves && reserves.tokenAddress0, lib),
  //       getERC20Token(reserves && reserves.tokenAddress1, lib),
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
  //           MASTERCHEFV2ADDRESSES[ChainId as number]
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
        ChainId === 137 || ChainId === 80001
          ? 2014.83125
          : ChainId === 56 || ChainId === 97
          ? 4300
          : ChainId === 42262 || ChainId === 42261
          ? 1343.220833
          : undefined
      );
      data.push(farm);
    }
    const iterated = data.filter((item) => item !== undefined);

    return iterated;
  };

  useMemo(async () => {
    if (ChainId) {
      try {
        setLoading(true);
        handleLoading(true);
        const masterchef = await MasterChefV2Contract(
          MASTERCHEFV2ADDRESSES[ChainId as number],
          lib
        );
        const rgpPrice = await calculateRigelPrice();

        const farmLength = await masterchef.poolLength();
        const LpAddress = await getLpfarmAddresses(farmLength, masterchef);

        if (
          ChainId !== SupportedChainId.OASISMAINNET &&
          ChainId !== SupportedChainId.OASISTEST
        ) {
          const specialPool = await RGPSpecialPool2(
            RGPSPECIALPOOLADDRESSES2[ChainId as number],
            lib
          );
          const rgp = await getERC20Token(RGPADDRESSES[ChainId as number], lib);
          const RGPBallance = await rgp.balanceOf(
            RGPSPECIALPOOLADDRESSES2[ChainId as number]
          );

          const RGPLiquidity =
            parseFloat(ethers.utils.formatUnits(RGPBallance)) * rgpPrice;

          const yeaRate = await specialPool.YEAR_RATE();

          //this is temporal

          handleUpdateSpecialPool([
            {
              id: "0",
              img: "rgp.svg",
              // deposit: 'RGP',
              deposit: "RGP",
              earn: "RGP",
              type: "RGP",
              ARYValue: ethers.utils.formatUnits(yeaRate),
              totalLiquidity: RGPLiquidity,
              tokensStaked: ["RGP", "0"],
              RGPEarned: "0",
              availableToken: "",
              inflationPerDay: 0,
              tokenPrice: 0,
              totalVolumePerPool: 0,
              farmingFee: 0,
              pId: 10793,
              poolAllowance: "",
              poolVersion: "2",
            },
          ]);
        }

        const farms = await loopFarms(LpAddress, rgpPrice);

        setLoading(false);

        handleLoading(false);
        handleUpdateChainId(ChainId);

        handleUpdateFarms(farms);
        setFarmData(farms);
        setReload(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }, [ChainId, reload]);

  return { farmdata, loadingState };
};
