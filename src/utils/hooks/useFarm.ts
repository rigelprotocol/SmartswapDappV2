import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import MultiCall from "@indexed-finance/multicall";
import MasterChefAbi from "../../utils/abis/masterChefV2.json";
import {
  MASTERCHEFV2ADDRESSES,
  SMARTSWAPFACTORYADDRESSES,
  RGPADDRESSES,
  BUSD,
  USDT,
  USDC,
  MASTERCHEFNEWLPADDRESSES,
  SMARTSWAPLP_TOKEN3ADDRESSES,
  SYMBOLS,
} from "../addresses";
import LiquidityPairAbi from "../../utils/abis/smartSwapLPToken.json";
import ERC20TokenAbi from "../../utils/abis/erc20.json";
import smartFactoryAbi from "../../utils/abis/SmartSwapFactoryForSwap.json";
import { useSelector } from "react-redux";
import { RootState } from "../../state";
import { ethers } from "ethers";
import { smartSwapLPTokenPoolThree } from "../Contracts";
import smartswapLpTokenThreeAbi from "../abis/SmartSwapLPTokenThree.json";
import {
  updateLpFarm,
  updateQuickSwapFarm,
  updateStableFarm,
} from "../../state/farm/actions";
import { useDispatch } from "react-redux";

type FarmData = Array<{
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
}>;

export const useFetchFarm = () => {
  const { account, library, chainId } = useWeb3React();

  const dispatch = useDispatch();

  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);

  const formatSymbol = (symbol: string) => {
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
    pools: any[],
    rgpPrice: number | undefined,

    reward?: number
  ) => {
    try {
      const multi = new MultiCall(library);

      const farms = [];

      const totalAllocPoint = await multi.multiCall([
        {
          interface: MasterChefAbi,
          args: [],
          target: MASTERCHEFV2ADDRESSES[chainId as number],
          function: "totalAllocPoint",
        },
      ]);

      const reserves = await getLpTokenReserve(pools);

      if (reserves) {
        for (let i = 0; i < reserves?.length; i++) {
          if (reserves[i].reserves0 !== null) {
            const totalRGP = reserves
              ? RGPADDRESSES[ChainId as number] === reserves[i].tokenAddress0
                ? reserves[i].reserves0.toString()
                : reserves[i].reserves1.toString()
              : "1";

            const totalStable = reserves
              ? BUSD[ChainId as number] === reserves[i].tokenAddress0 ||
                USDT[ChainId as number] === reserves[i].tokenAddress0 ||
                USDC[ChainId as number] === reserves[i].tokenAddress0
                ? ethers.utils.formatUnits(
                    reserves[i].reserves0.toString(),
                    reserves[i].decimals0
                  )
                : ethers.utils.formatUnits(
                    reserves[i].reserves1.toString(),
                    reserves[i].decimals1
                  )
              : "1";

            const totalLiquidity =
              reserves[i]?.symbol0 === "BUSD" ||
              reserves[i]?.symbol1 === "BUSD" ||
              reserves[i]?.symbol0 === "USDT" ||
              reserves[i]?.symbol1 === "USDT" ||
              reserves[i]?.symbol0 === "USDC" ||
              reserves[i]?.symbol1 === "USDC"
                ? parseFloat(totalStable) * 2
                : parseFloat(ethers.utils.formatEther(totalRGP)) *
                  (rgpPrice as number) *
                  2;
            const allocPoint = reserves[i].allocPoint;
            const poolReward =
              (parseFloat(allocPoint.toString()) /
                parseFloat(totalAllocPoint[1][0].toString())) *
              (reward as number);
            const APY =
              ((rgpPrice as number) * poolReward * 365 * 100) / totalLiquidity;

            farms.push({
              id: reserves[i].pid,
              img: "rgp.svg",
              deposit: `${formatSymbol(reserves[i]?.symbol0)}-${formatSymbol(
                reserves[i]?.symbol1
              )}`,
              symbol0: formatSymbol(reserves[i]?.symbol0),
              symbol1: formatSymbol(reserves[i]?.symbol1),
              earn: "RGP",
              type: "LP",
              totalLiquidity,
              APY,
              allocPoint: parseFloat(allocPoint.toString()),
              address: pools[i].poolAddress,
              tokenStaked: [
                `${formatSymbol(reserves[i]?.symbol0)}-${formatSymbol(
                  reserves[i]?.symbol1
                )}`,
              ],
            });
          }
        }
        return farms;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateRigelPrice = async () => {
    try {
      const multi = new MultiCall(library);
      let rgpPrice;

      if (ChainId === 56 || ChainId === 97) {
        const pairAddress = await multi.multiCall([
          {
            interface: smartFactoryAbi,
            args: [RGPADDRESSES[ChainId as number], BUSD[ChainId as number]],
            target: SMARTSWAPFACTORYADDRESSES[ChainId as number],
            function: "getPair",
          },
        ]);
        const token0Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token0",
          },
        ]);
        const token1Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token1",
          },
        ]);

        const decimal0 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token0Address[1][0],
            function: "decimals",
          },
        ]);

        const decimal1 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token1Address[1][0],
            function: "decimals",
          },
        ]);

        const reserves = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "getReserves",
          },
        ]);
        const totalBUSD: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === BUSD[ChainId as number]
            ? reserves[1][0][0]
            : reserves[1][0][1],
          token0Address[1][0] === BUSD[ChainId as number]
            ? decimal0[1][0]
            : decimal1[1][0]
        );

        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === BUSD[ChainId as number]
            ? reserves[1][0][1]
            : reserves[1][0][0],
          token0Address[1][0] === BUSD[ChainId as number]
            ? decimal1[1][0]
            : decimal0[1][0]
        );

        rgpPrice = totalBUSD / totalRGP;
      } else {
        const pairAddress = await multi.multiCall([
          {
            interface: smartFactoryAbi,
            args: [RGPADDRESSES[ChainId as number], USDT[ChainId as number]],
            target: SMARTSWAPFACTORYADDRESSES[ChainId as number],
            function: "getPair",
          },
        ]);

        const token0Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token0",
          },
        ]);
        const token1Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token1",
          },
        ]);
        const decimal0 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token0Address[1][0],
            function: "decimals",
          },
        ]);

        const decimal1 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token1Address[1][0],
            function: "decimals",
          },
        ]);
        const reserves = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "getReserves",
          },
        ]);
        const totalUSDT: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === USDT[ChainId as number]
            ? reserves[1][0][0]
            : reserves[1][0][1],
          token0Address[1][0] === USDT[ChainId as number]
            ? decimal0[1][0]
            : decimal1[1][0]
        );
        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === USDT[ChainId as number]
            ? reserves[1][0][1]
            : reserves[1][0][0],
          token0Address[1][0] === USDT[ChainId as number]
            ? decimal1[1][0]
            : decimal0[1][0]
        );
        rgpPrice = totalUSDT / totalRGP;
      }

      return rgpPrice;
    } catch (err) {
      console.log(err);
    }
  };

  const getLpTokenReserve = async (pools: any[]) => {
    try {
      const multi = new MultiCall(library);

      const LpReserves = [];

      const reservesInputs = [];
      const poolInfoInputs = [];

      const token0Inputs = [];
      const token1Inputs = [];

      const symbol0Inputs = [];
      const symbol1Inputs = [];
      const decimal0Inputs = [];
      const decimal1Inputs = [];

      for (let i = 0; i < pools.length; i++) {
        reservesInputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "getReserves",
        });

        poolInfoInputs.push({
          interface: MasterChefAbi,
          args: [i],
          target: MASTERCHEFV2ADDRESSES[chainId as number],
          function: "poolInfo",
        });

        token0Inputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "token0",
        });

        token1Inputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "token1",
        });
      }

      const reserves = await multi.multiCall(reservesInputs);
      const poolInfo = await multi.multiCall(poolInfoInputs);
      const token0 = await multi.multiCall(token0Inputs);
      const token1 = await multi.multiCall(token1Inputs);

      console.log(reserves[1]);

      console.log("token0", token0);

      for (let i = 0; i < token0[1].length; i++) {
        symbol0Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token0[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token0[1][i],
          function: "symbol",
        });

        decimal0Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token0[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token0[1][i],
          function: "decimals",
        });
      }

      for (let i = 0; i < token1[1].length; i++) {
        symbol1Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token1[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token1[1][i],
          function: "symbol",
        });

        decimal1Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token1[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token1[1][i],
          function: "decimals",
        });
      }

      const symbol0 = await multi.multiCall(symbol0Inputs);
      const symbol1 = await multi.multiCall(symbol1Inputs);
      const decimals0 = await multi.multiCall(decimal0Inputs);
      const decimals1 = await multi.multiCall(decimal1Inputs);

      for (let i = 0; i < reserves[1].length; i++) {
        LpReserves.push({
          pid: i,
          reserves0: reserves[1][i] == null ? null : reserves[1][i][0],
          reserves1: reserves[1][i] == null ? null : reserves[1][i][1],
          allocPoint: parseFloat(poolInfo[1][i].allocPoint.toString()),
          tokenAddress0: token0[1][i],
          tokenAddress1: token1[1][i],
          decimals0: decimals0[1][i],
          decimals1: decimals1[1][i],
          symbol0: symbol0[1][i],
          symbol1: symbol1[1][i],
        });
      }

      console.log("Lpreserves", LpReserves);

      return LpReserves;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPools = async () => {
      if (account) {
        try {
          console.log("started");
          const multi = new MultiCall(library);

          const poolAddresses = [];

          const rgpPrice = await calculateRigelPrice();

          const poolLength = await multi.multiCall([
            {
              interface: MasterChefAbi,
              args: [],
              target: MASTERCHEFV2ADDRESSES[chainId as number],
              function: "poolLength",
            },
          ]);

          console.log("poolLength", poolLength);

          for (let i = 0; i < parseFloat(poolLength[1][0].toString()); i++) {
            const poolInfo = await multi.multiCall([
              {
                interface: MasterChefAbi,
                args: [i],
                target: MASTERCHEFV2ADDRESSES[chainId as number],
                function: "poolInfo",
              },
            ]);

            poolAddresses.push({
              poolAddress: poolInfo[1][0]?.lpToken,
              allocPoint: poolInfo[1][0]?.allocPoint,
            });
          }

          const farm = await calculateLiquidityandApy(
            poolAddresses,
            rgpPrice,
            ChainId === 137 || ChainId === 80001
              ? 2014.83125
              : ChainId === 56 || ChainId === 97
              ? 4300
              : ChainId === 42262 || ChainId === 42261
              ? 1343.220833
              : undefined
          );

          if (farm) {
            dispatch(updateLpFarm(farm));
          }

          console.log("useFarm", farm);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchPools();
  }, [account, ChainId]);
};

export const useFetchQuickSwap = () => {
  const { account, library, chainId } = useWeb3React();

  const dispatch = useDispatch();

  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);

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
    pools: any[],
    rgpPrice: number | undefined,
    BNBPrice: number | undefined,

    reward?: number
  ) => {
    try {
      const multi = new MultiCall(library);

      const farms = [];

      const totalAllocPoint = await multi.multiCall([
        {
          interface: MasterChefAbi,
          args: [],
          target: MASTERCHEFNEWLPADDRESSES[chainId as number][1],
          function: "totalAllocPoint",
        },
      ]);

      const reserves = await getLpTokenReserve(pools);

      if (reserves) {
        for (let i = 0; i < reserves?.length; i++) {
          if (reserves[i].reserves0 !== null) {
            const totalRGP = reserves
              ? RGPADDRESSES[ChainId as number] === reserves[i].tokenAddress0
                ? reserves[i].reserves0.toString()
                : reserves[i].reserves1.toString()
              : "1";

            const totalBNB = reserves
              ? SYMBOLS["BNB"][ChainId as number] === reserves[i].tokenAddress0
                ? reserves[i].reserves0.toString()
                : reserves[i].reserves1.toString()
              : "1";

            const totalStable = reserves
              ? BUSD[ChainId as number] === reserves[i].tokenAddress0 ||
                USDT[ChainId as number] === reserves[i].tokenAddress0 ||
                USDC[ChainId as number] === reserves[i].tokenAddress0
                ? ethers.utils.formatUnits(
                    reserves[i].reserves0.toString(),
                    reserves[i].decimals0
                  )
                : ethers.utils.formatUnits(
                    reserves[i].reserves1.toString(),
                    reserves[i].decimals1
                  )
              : "1";

            const totalLiquidity =
              reserves[i]?.symbol0 === "BUSD" ||
              reserves[i]?.symbol1 === "BUSD" ||
              reserves[i]?.symbol0 === "USDT" ||
              reserves[i]?.symbol1 === "USDT" ||
              reserves[i]?.symbol0 === "USDC" ||
              reserves[i]?.symbol1 === "USDC"
                ? parseFloat(totalStable) * 2
                : reserves[i]?.symbol0 === "WBNB" ||
                  reserves[i]?.symbol1 === "WBNB"
                ? parseFloat(ethers.utils.formatEther(totalBNB)) *
                  (BNBPrice as number) *
                  2
                : parseFloat(ethers.utils.formatEther(totalRGP)) *
                  (rgpPrice as number) *
                  2;
            const allocPoint = reserves[i].allocPoint;

            const poolReward =
              (parseFloat(allocPoint.toString()) /
                parseFloat(totalAllocPoint[1][0].toString())) *
              (reward as number);

            const LiquidityLocked =
              parseFloat(ethers.utils.formatEther(reserves[i].lockedSupply)) /
              parseFloat(ethers.utils.formatEther(reserves[i].totalSupply));

            const newLiquidity = LiquidityLocked * totalLiquidity;
            const APY =
              ((rgpPrice as number) * poolReward * 365 * 100) / newLiquidity;

            farms.push({
              id: reserves[i].pid,
              img: "rgp.svg",
              deposit: `${await formatSymbol(
                reserves[i]?.symbol0
              )}-${await formatSymbol(reserves[i]?.symbol1)}`,
              symbol0: await formatSymbol(reserves[i]?.symbol0),
              symbol1: await formatSymbol(reserves[i]?.symbol1),
              earn: "RGP",
              type: "LP",
              totalLiquidity,
              APY,
              allocPoint: parseFloat(allocPoint.toString()),
              address: pools[i].poolAddress,
              LPLocked: newLiquidity.toFixed(2),
            });
          }
        }
        return farms;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getBNBPrice = async () => {
    try {
      const multi = new MultiCall(library);
      let BNBPrice;

      //   const pair = await smartSwapLPTokenPoolThree(
      //     SMARTSWAPLP_TOKEN3ADDRESSES[ChainId as number],
      //     lib
      //   );

      const reserves = await multi.multiCall([
        {
          interface: smartswapLpTokenThreeAbi,
          target: SMARTSWAPLP_TOKEN3ADDRESSES[ChainId as number],
          args: [],
          function: "getReserves",
        },
      ]);

      //   const reserves = await pair.getReserves();
      const testNetPair = SMARTSWAPLP_TOKEN3ADDRESSES[97];

      // BUSD is token0 on testnet but token1 on mainnet, thus the reason to check
      // before calculating the price based on BUSD

      if (SMARTSWAPLP_TOKEN3ADDRESSES[ChainId as number] === testNetPair) {
        BNBPrice = ethers.utils.formatUnits(
          reserves[1][0][0].mul(1000).div(reserves[1][0][1]),
          3
        );
      } else {
        BNBPrice = ethers.utils.formatUnits(
          reserves[1][0][1].mul(1000).div(reserves[1][0][0]),
          3
        );
      }
      return Number(BNBPrice);
    } catch (e) {
      console.log("Could not fetch BNB Price.");
    }
  };

  const calculateRigelPrice = async () => {
    try {
      const multi = new MultiCall(library);
      let rgpPrice;

      if (ChainId === 56 || ChainId === 97) {
        const pairAddress = await multi.multiCall([
          {
            interface: smartFactoryAbi,
            args: [RGPADDRESSES[ChainId as number], BUSD[ChainId as number]],
            target: SMARTSWAPFACTORYADDRESSES[ChainId as number],
            function: "getPair",
          },
        ]);
        const token0Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token0",
          },
        ]);
        const token1Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token1",
          },
        ]);

        const decimal0 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token0Address[1][0],
            function: "decimals",
          },
        ]);

        const decimal1 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token1Address[1][0],
            function: "decimals",
          },
        ]);

        const reserves = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "getReserves",
          },
        ]);
        const totalBUSD: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === BUSD[ChainId as number]
            ? reserves[1][0][0]
            : reserves[1][0][1],
          token0Address[1][0] === BUSD[ChainId as number]
            ? decimal0[1][0]
            : decimal1[1][0]
        );

        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === BUSD[ChainId as number]
            ? reserves[1][0][1]
            : reserves[1][0][0],
          token0Address[1][0] === BUSD[ChainId as number]
            ? decimal1[1][0]
            : decimal0[1][0]
        );

        rgpPrice = totalBUSD / totalRGP;
      } else {
        const pairAddress = await multi.multiCall([
          {
            interface: smartFactoryAbi,
            args: [RGPADDRESSES[ChainId as number], USDT[ChainId as number]],
            target: SMARTSWAPFACTORYADDRESSES[ChainId as number],
            function: "getPair",
          },
        ]);

        const token0Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token0",
          },
        ]);
        const token1Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token1",
          },
        ]);
        const decimal0 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token0Address[1][0],
            function: "decimals",
          },
        ]);

        const decimal1 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token1Address[1][0],
            function: "decimals",
          },
        ]);
        const reserves = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "getReserves",
          },
        ]);
        const totalUSDT: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === USDT[ChainId as number]
            ? reserves[1][0][0]
            : reserves[1][0][1],
          token0Address[1][0] === USDT[ChainId as number]
            ? decimal0[1][0]
            : decimal1[1][0]
        );
        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === USDT[ChainId as number]
            ? reserves[1][0][1]
            : reserves[1][0][0],
          token0Address[1][0] === USDT[ChainId as number]
            ? decimal1[1][0]
            : decimal0[1][0]
        );
        rgpPrice = totalUSDT / totalRGP;
      }

      return rgpPrice;
    } catch (err) {
      console.log(err);
    }
  };

  const getLpTokenReserve = async (pools: any[]) => {
    try {
      const multi = new MultiCall(library);

      const LpReserves = [];

      const reservesInputs = [];
      const poolInfoInputs = [];

      const token0Inputs = [];
      const token1Inputs = [];

      const symbol0Inputs = [];
      const symbol1Inputs = [];
      const decimal0Inputs = [];
      const decimal1Inputs = [];
      const totalSupplyInputs = [];
      const lockedSupplyInputs = [];

      for (let i = 0; i < pools.length; i++) {
        console.log("before-anything", [
          MASTERCHEFNEWLPADDRESSES[ChainId as number][1],
        ]);
        reservesInputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i]?.poolAddress,
          function: "getReserves",
        });

        poolInfoInputs.push({
          interface: MasterChefAbi,
          args: [i],
          target: MASTERCHEFNEWLPADDRESSES[chainId as number][1],
          function: "poolInfo",
        });

        token0Inputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i]?.poolAddress,
          function: "token0",
        });

        token1Inputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i]?.poolAddress,
          function: "token1",
        });

        totalSupplyInputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i]?.poolAddress,
          function: "totalSupply",
        });

        lockedSupplyInputs.push({
          interface: LiquidityPairAbi,
          args: [MASTERCHEFNEWLPADDRESSES[ChainId as number][1]],
          target: pools[i]?.poolAddress,
          function: "balanceOf",
        });
      }

      console.log("got here", pools);

      const reserves = await multi.multiCall(reservesInputs);

      console.log("reserves", reserves);
      const poolInfo = await multi.multiCall(poolInfoInputs);
      const token0 = await multi.multiCall(token0Inputs);
      const token1 = await multi.multiCall(token1Inputs);
      const totalSupply = await multi.multiCall(totalSupplyInputs);
      const lockedSupply = await multi.multiCall(lockedSupplyInputs);

      console.log(reserves[1]);

      console.log("token0", token0);

      for (let i = 0; i < token0[1].length; i++) {
        symbol0Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token0[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token0[1][i],
          function: "symbol",
        });

        decimal0Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token0[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token0[1][i],
          function: "decimals",
        });
      }

      for (let i = 0; i < token1[1].length; i++) {
        symbol1Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token1[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token1[1][i],
          function: "symbol",
        });

        decimal1Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token1[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token1[1][i],
          function: "decimals",
        });
      }

      const symbol0 = await multi.multiCall(symbol0Inputs);
      const symbol1 = await multi.multiCall(symbol1Inputs);
      const decimals0 = await multi.multiCall(decimal0Inputs);
      const decimals1 = await multi.multiCall(decimal1Inputs);

      for (let i = 0; i < reserves[1].length; i++) {
        LpReserves.push({
          pid: i,
          reserves0: reserves[1][i] == null ? null : reserves[1][i][0],
          reserves1: reserves[1][i] == null ? null : reserves[1][i][1],
          allocPoint: parseFloat(poolInfo[1][i].allocPoint.toString()),
          tokenAddress0: token0[1][i],
          tokenAddress1: token1[1][i],
          decimals0: decimals0[1][i],
          decimals1: decimals1[1][i],
          symbol0: symbol0[1][i],
          symbol1: symbol1[1][i],
          totalSupply: totalSupply[1][i],
          lockedSupply: lockedSupply[1][i],
          tokenStaked: [
            `${await formatSymbol(symbol0[1][i])}-${await formatSymbol(
              symbol1[1][i]
            )}`,
          ],
        });
      }

      console.log("Lpreserves", LpReserves);

      return LpReserves;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPools = async () => {
      if (account) {
        try {
          console.log("started");
          const multi = new MultiCall(library);

          const poolAddresses = [];

          const rgpPrice = await calculateRigelPrice();

          const BNBPrice = await getBNBPrice();

          const poolLength = await multi.multiCall([
            {
              interface: MasterChefAbi,
              args: [],
              target: MASTERCHEFNEWLPADDRESSES[chainId as number][1],
              function: "poolLength",
            },
          ]);

          console.log("poolLength", poolLength);

          for (let i = 0; i < parseFloat(poolLength[1][0].toString()); i++) {
            const poolInfo = await multi.multiCall([
              {
                interface: MasterChefAbi,
                args: [i],
                target: MASTERCHEFNEWLPADDRESSES[chainId as number][1],
                function: "poolInfo",
              },
            ]);

            console.log("before fail", poolInfo[1][0]);

            poolInfo[1][0]?.lpToken !== undefined &&
              poolAddresses.push({
                pid: i,
                poolAddress: poolInfo[1][0]?.lpToken,
                allocPoint: poolInfo[1][0]?.allocPoint,
              });
          }

          console.log("before fail", poolAddresses);

          const farm = await calculateLiquidityandApy(
            poolAddresses,
            rgpPrice,
            BNBPrice,
            ChainId === 137 || ChainId === 80001
              ? 2014.83125
              : ChainId === 56 || ChainId === 97
              ? 4300
              : ChainId === 42262 || ChainId === 42261
              ? 1343.220833
              : undefined
          );

          if (farm) {
            dispatch(updateQuickSwapFarm(farm));
          }

          console.log("useFarm-quick", farm);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchPools();
  }, [account, ChainId]);
};

export const useFetchStable = () => {
  const { account, library, chainId } = useWeb3React();
  const dispatch = useDispatch();

  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);

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
    pools: any[],
    rgpPrice: number | undefined,
    BNBPrice: number | undefined,

    reward?: number
  ) => {
    try {
      const multi = new MultiCall(library);

      const farms = [];

      const totalAllocPoint = await multi.multiCall([
        {
          interface: MasterChefAbi,
          args: [],
          target: MASTERCHEFNEWLPADDRESSES[chainId as number][1],
          function: "totalAllocPoint",
        },
      ]);

      const reserves = await getLpTokenReserve(pools);

      if (reserves) {
        for (let i = 0; i < reserves?.length; i++) {
          if (reserves[i].reserves0 !== null) {
            const totalRGP = reserves
              ? RGPADDRESSES[ChainId as number] === reserves[i].tokenAddress0
                ? reserves[i].reserves0.toString()
                : reserves[i].reserves1.toString()
              : "1";

            const totalBNB = reserves
              ? SYMBOLS["BNB"][ChainId as number] === reserves[i].tokenAddress0
                ? reserves[i].reserves0.toString()
                : reserves[i].reserves1.toString()
              : "1";

            const totalStable = reserves
              ? BUSD[ChainId as number] === reserves[i].tokenAddress0 ||
                USDT[ChainId as number] === reserves[i].tokenAddress0 ||
                USDC[ChainId as number] === reserves[i].tokenAddress0
                ? ethers.utils.formatUnits(
                    reserves[i].reserves0.toString(),
                    reserves[i].decimals0
                  )
                : ethers.utils.formatUnits(
                    reserves[i].reserves1.toString(),
                    reserves[i].decimals1
                  )
              : "1";

            const totalLiquidity =
              reserves[i]?.symbol0 === "BUSD" ||
              reserves[i]?.symbol1 === "BUSD" ||
              reserves[i]?.symbol0 === "USDT" ||
              reserves[i]?.symbol1 === "USDT" ||
              reserves[i]?.symbol0 === "USDC" ||
              reserves[i]?.symbol1 === "USDC"
                ? parseFloat(totalStable) * 2
                : reserves[i]?.symbol0 === "WBNB" ||
                  reserves[i]?.symbol1 === "WBNB"
                ? parseFloat(ethers.utils.formatEther(totalBNB)) *
                  (BNBPrice as number) *
                  2
                : parseFloat(ethers.utils.formatEther(totalRGP)) *
                  (rgpPrice as number) *
                  2;
            const allocPoint = reserves[i].allocPoint;

            const poolReward =
              (parseFloat(allocPoint.toString()) /
                parseFloat(totalAllocPoint[1][0].toString())) *
              (reward as number);

            const LiquidityLocked =
              parseFloat(ethers.utils.formatEther(reserves[i].lockedSupply)) /
              parseFloat(ethers.utils.formatEther(reserves[i].totalSupply));

            const newLiquidity = LiquidityLocked * totalLiquidity;
            const APY =
              ((rgpPrice as number) * poolReward * 365 * 100) / newLiquidity;

            farms.push({
              id: reserves[i].pid,
              img: "rgp.svg",
              deposit: `${await formatSymbol(
                reserves[i]?.symbol0
              )}-${await formatSymbol(reserves[i]?.symbol1)}`,
              symbol0: await formatSymbol(reserves[i]?.symbol0),
              symbol1: await formatSymbol(reserves[i]?.symbol1),
              earn: "RGP",
              type: "LP",
              totalLiquidity,
              APY,
              allocPoint: parseFloat(allocPoint.toString()),
              address: pools[i].poolAddress,
              LPLocked: newLiquidity.toFixed(2),
              tokenStaked: [
                `${await formatSymbol(
                  reserves[i]?.symbol0
                )}-${await formatSymbol(reserves[i]?.symbol1)}`,
              ],
            });
          }
        }
        return farms;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getBNBPrice = async () => {
    try {
      const multi = new MultiCall(library);
      let BNBPrice;

      //   const pair = await smartSwapLPTokenPoolThree(
      //     SMARTSWAPLP_TOKEN3ADDRESSES[ChainId as number],
      //     lib
      //   );

      const reserves = await multi.multiCall([
        {
          interface: smartswapLpTokenThreeAbi,
          target: SMARTSWAPLP_TOKEN3ADDRESSES[ChainId as number],
          args: [],
          function: "getReserves",
        },
      ]);

      //   const reserves = await pair.getReserves();
      const testNetPair = SMARTSWAPLP_TOKEN3ADDRESSES[97];

      // BUSD is token0 on testnet but token1 on mainnet, thus the reason to check
      // before calculating the price based on BUSD

      if (SMARTSWAPLP_TOKEN3ADDRESSES[ChainId as number] === testNetPair) {
        BNBPrice = ethers.utils.formatUnits(
          reserves[1][0][0].mul(1000).div(reserves[1][0][1]),
          3
        );
      } else {
        BNBPrice = ethers.utils.formatUnits(
          reserves[1][0][1].mul(1000).div(reserves[1][0][0]),
          3
        );
      }
      return Number(BNBPrice);
    } catch (e) {
      console.log("Could not fetch BNB Price.");
    }
  };

  const calculateRigelPrice = async () => {
    try {
      const multi = new MultiCall(library);
      let rgpPrice;

      if (ChainId === 56 || ChainId === 97) {
        const pairAddress = await multi.multiCall([
          {
            interface: smartFactoryAbi,
            args: [RGPADDRESSES[ChainId as number], BUSD[ChainId as number]],
            target: SMARTSWAPFACTORYADDRESSES[ChainId as number],
            function: "getPair",
          },
        ]);
        const token0Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token0",
          },
        ]);
        const token1Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token1",
          },
        ]);

        const decimal0 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token0Address[1][0],
            function: "decimals",
          },
        ]);

        const decimal1 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token1Address[1][0],
            function: "decimals",
          },
        ]);

        const reserves = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "getReserves",
          },
        ]);
        const totalBUSD: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === BUSD[ChainId as number]
            ? reserves[1][0][0]
            : reserves[1][0][1],
          token0Address[1][0] === BUSD[ChainId as number]
            ? decimal0[1][0]
            : decimal1[1][0]
        );

        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === BUSD[ChainId as number]
            ? reserves[1][0][1]
            : reserves[1][0][0],
          token0Address[1][0] === BUSD[ChainId as number]
            ? decimal1[1][0]
            : decimal0[1][0]
        );

        rgpPrice = totalBUSD / totalRGP;
      } else {
        const pairAddress = await multi.multiCall([
          {
            interface: smartFactoryAbi,
            args: [RGPADDRESSES[ChainId as number], USDT[ChainId as number]],
            target: SMARTSWAPFACTORYADDRESSES[ChainId as number],
            function: "getPair",
          },
        ]);

        const token0Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token0",
          },
        ]);
        const token1Address = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "token1",
          },
        ]);
        const decimal0 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token0Address[1][0],
            function: "decimals",
          },
        ]);

        const decimal1 = await multi.multiCall([
          {
            interface: ERC20TokenAbi,
            args: [],
            target: token1Address[1][0],
            function: "decimals",
          },
        ]);
        const reserves = await multi.multiCall([
          {
            interface: LiquidityPairAbi,
            args: [],
            target: pairAddress[1][0],
            function: "getReserves",
          },
        ]);
        const totalUSDT: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === USDT[ChainId as number]
            ? reserves[1][0][0]
            : reserves[1][0][1],
          token0Address[1][0] === USDT[ChainId as number]
            ? decimal0[1][0]
            : decimal1[1][0]
        );
        const totalRGP: number | any = ethers.utils.formatUnits(
          token0Address[1][0] === USDT[ChainId as number]
            ? reserves[1][0][1]
            : reserves[1][0][0],
          token0Address[1][0] === USDT[ChainId as number]
            ? decimal1[1][0]
            : decimal0[1][0]
        );
        rgpPrice = totalUSDT / totalRGP;
      }

      return rgpPrice;
    } catch (err) {
      console.log(err);
    }
  };

  const getLpTokenReserve = async (pools: any[]) => {
    try {
      const multi = new MultiCall(library);

      const LpReserves = [];

      const reservesInputs = [];
      const poolInfoInputs = [];

      const token0Inputs = [];
      const token1Inputs = [];

      const symbol0Inputs = [];
      const symbol1Inputs = [];
      const decimal0Inputs = [];
      const decimal1Inputs = [];
      const totalSupplyInputs = [];
      const lockedSupplyInputs = [];

      for (let i = 0; i < pools.length; i++) {
        reservesInputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "getReserves",
        });

        poolInfoInputs.push({
          interface: MasterChefAbi,
          args: [i],
          target: MASTERCHEFNEWLPADDRESSES[chainId as number][2],
          function: "poolInfo",
        });

        token0Inputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "token0",
        });

        token1Inputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "token1",
        });

        totalSupplyInputs.push({
          interface: LiquidityPairAbi,
          args: [],
          target: pools[i].poolAddress,
          function: "totalSupply",
        });

        lockedSupplyInputs.push({
          interface: LiquidityPairAbi,
          args: [MASTERCHEFNEWLPADDRESSES[ChainId as number][2]],
          target: pools[i].poolAddress,
          function: "balanceOf",
        });
      }

      console.log("got here", pools);

      const reserves = await multi.multiCall(reservesInputs);

      console.log("reserves", reserves);
      const poolInfo = await multi.multiCall(poolInfoInputs);
      const token0 = await multi.multiCall(token0Inputs);
      const token1 = await multi.multiCall(token1Inputs);
      const totalSupply = await multi.multiCall(totalSupplyInputs);
      const lockedSupply = await multi.multiCall(lockedSupplyInputs);

      console.log(reserves[1]);

      console.log("token0", token0);

      for (let i = 0; i < token0[1].length; i++) {
        symbol0Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token0[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token0[1][i],
          function: "symbol",
        });

        decimal0Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token0[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token0[1][i],
          function: "decimals",
        });
      }

      for (let i = 0; i < token1[1].length; i++) {
        symbol1Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token1[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token1[1][i],
          function: "symbol",
        });

        decimal1Inputs.push({
          interface: ERC20TokenAbi,
          args: [],
          target:
            token1[1][i] == null
              ? RGPADDRESSES[chainId as number]
              : token1[1][i],
          function: "decimals",
        });
      }

      const symbol0 = await multi.multiCall(symbol0Inputs);
      const symbol1 = await multi.multiCall(symbol1Inputs);
      const decimals0 = await multi.multiCall(decimal0Inputs);
      const decimals1 = await multi.multiCall(decimal1Inputs);

      for (let i = 0; i < reserves[1].length; i++) {
        LpReserves.push({
          pid: i,
          reserves0: reserves[1][i] == null ? null : reserves[1][i][0],
          reserves1: reserves[1][i] == null ? null : reserves[1][i][1],
          allocPoint: parseFloat(poolInfo[1][i].allocPoint.toString()),
          tokenAddress0: token0[1][i],
          tokenAddress1: token1[1][i],
          decimals0: decimals0[1][i],
          decimals1: decimals1[1][i],
          symbol0: symbol0[1][i],
          symbol1: symbol1[1][i],
          totalSupply: totalSupply[1][i],
          lockedSupply: lockedSupply[1][i],
          tokenStaked: [
            `${await formatSymbol(symbol0[1][i])}-${await formatSymbol(
              symbol1[1][i]
            )}`,
          ],
        });
      }

      console.log("Lpreserves", LpReserves);

      return LpReserves;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPools = async () => {
      if (account) {
        try {
          console.log("started");
          const multi = new MultiCall(library);

          const poolAddresses = [];

          const rgpPrice = await calculateRigelPrice();

          const BNBPrice = await getBNBPrice();

          const poolLength = await multi.multiCall([
            {
              interface: MasterChefAbi,
              args: [],
              target: MASTERCHEFNEWLPADDRESSES[chainId as number][2],
              function: "poolLength",
            },
          ]);

          console.log("poolLength", poolLength);

          for (let i = 0; i < parseFloat(poolLength[1][0].toString()); i++) {
            const poolInfo = await multi.multiCall([
              {
                interface: MasterChefAbi,
                args: [i],
                target: MASTERCHEFNEWLPADDRESSES[chainId as number][2],
                function: "poolInfo",
              },
            ]);

            poolInfo[1][0]?.lpToken !== undefined &&
              poolAddresses.push({
                pid: i,
                poolAddress: poolInfo[1][0]?.lpToken,
                allocPoint: poolInfo[1][0]?.allocPoint,
              });
          }

          const farm = await calculateLiquidityandApy(
            poolAddresses,
            rgpPrice,
            BNBPrice,
            ChainId === 137 || ChainId === 80001
              ? 2014.83125
              : ChainId === 56 || ChainId === 97
              ? 4300
              : ChainId === 42262 || ChainId === 42261
              ? 1343.220833
              : undefined
          );

          if (farm) {
            dispatch(updateStableFarm(farm));
          }

          console.log("useFarm-quick", farm);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchPools();
  }, [account, ChainId]);
};
