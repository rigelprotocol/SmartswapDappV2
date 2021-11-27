import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
  smartFactory,
  LiquidityPairInstance,
  SmartSwapRouter,
} from '../Contracts';
import { SMARTSWAPFACTORYADDRESSES, SMARTSWAPROUTER } from '../addresses';
import { getERC20Token } from '../utilsFunctions';
import { ethers } from 'ethers';
import { Currency, Fraction, Percent } from '@uniswap/sdk-core';
import { WNATIVEADDRESSES } from '../addresses';
import JSBI from 'jsbi';

export const useGetUserLiquidities = async () => {
  const { account, chainId } = useWeb3React();
  const [liquidities, setLiquidities] = useState<any[]>();
  const [liquidityLength, setLiquidityLength] = useState(0);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserPairs = async () => {
      if (account) {
        setLoading(true);
        try {
          const SmartFactory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number]
          );
          const allLiquidityPairs = await SmartFactory.allPairsLength();
          const allExchange = await Promise.all(
            getAllPairs(allLiquidityPairs.toNumber(), SmartFactory.allPairs)
          );
          const pairsData = await Promise.all(
            allExchange.map((address) =>
              getPoolData(address, account, chainId as number)
            )
          );
          const userPairs = pairsData.filter(
            (pair) => parseFloat(pair.poolToken) !== 0
          );
          setLiquidities(userPairs);
          setLiquidityLength(userPairs.length);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLiquidities(undefined);
          setLiquidityLength(0);
          setLoading(false);
        }
      }
    };
    loadUserPairs();
  }, [chainId, account]);

  return { liquidities, liquidityLength, Loading };
};

const getAllPairs = (length: number, allPairs: any): any[] => {
  const pairs = [];
  for (let i = 0; i < length; i++) {
    pairs.push(allPairs(i));
  }
  return pairs;
};

const getPoolData = async (
  address: string,
  account: string,
  chainId: number
) => {
  const liquidity = await LiquidityPairInstance(address);
  const [balance, totalSupply, reserves, token0, token1, allowance] =
    await Promise.all([
      liquidity.balanceOf(account),
      liquidity.totalSupply(),
      liquidity.getReserves(),
      liquidity.token0(),
      liquidity.token1(),
      liquidity.allowance(account, SMARTSWAPROUTER[chainId]),
    ]);
  const [erc20Token0, erc20Token1] = await Promise.all([
    getERC20Token(token0),
    getERC20Token(token1),
  ]);
  const [symbol0, symbol1] = await Promise.all([
    erc20Token0.symbol(),
    erc20Token1.symbol(),
  ]);

  const [decimals0, decimals1] = await Promise.all([
    erc20Token0.decimals(),
    erc20Token1.decimals(),
  ]);

  const pooledToken0 = getPooledToken({
    balance,
    totalSupply,
    reserves: reserves[0],
    decimals: decimals0,
  });
  const pooledToken1 = getPooledToken({
    balance,
    totalSupply,
    reserves: reserves[1],
    decimals: decimals1,
  });

  const approved = allowance > balance;

  const liquidityObject = {
    pairAddress: address,
    poolToken: ethers.utils.formatEther(balance),
    totalSupply: totalSupply.toString(),
    poolShare: (balance.toString() / totalSupply) * 100,
    path: [
      { fromPath: token0, token: symbol0, amount: pooledToken0 },
      { toPath: token1, token: symbol1, amount: pooledToken1 },
    ],
    pooledToken0,
    pooledToken1,
    approved: approved,
  };
  return liquidityObject;
};

interface PoolTokenParams {
  balance: number;
  totalSupply: number;
  reserves: number;
  decimals: number;
}

const getPooledToken = (params: PoolTokenParams) => {
  //construct decimal
  const Decimal = 10 ** params.decimals;
  //init fraction class
  const fraction = new Fraction(
    params.balance.toString(),
    params.totalSupply.toString()
  );
  const multiplyReserve = fraction.multiply(params.reserves.toString());
  const final = multiplyReserve.divide(Decimal);
  return final.toSignificant(params.decimals);
};

export const useGetLiquidityById = async (
  address1: string,
  address2: string,
  hasBeenApproved: boolean
) => {
  const { account, chainId } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const [LiquidityPairData, setLiquidityPairData] = useState<any>();
  const [approved, setApproved] = useState(false);

  useMemo(() => {
    const loadPair = async () => {
      if (account) {
        setLoading(true);
        try {
          const SmartFactory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number]
          );

          const Pair = await SmartFactory.getPair(address1, address2);
          const PairData = await getPoolData(Pair, account, chainId as number);
          setLoading(false);
          setLiquidityPairData(PairData);
          setApproved(PairData.approved);
        } catch (err) {
          console.log(err);
          setLiquidityPairData([]);
          setLoading(false);
        }
      }
    };
    loadPair();
  }, [account, chainId, address1, address2, hasBeenApproved]);
  return { LiquidityPairData, loading, approved };
};

const getAddress = (currency: Currency | undefined) => {
  const address = currency?.isNative
    ? WNATIVEADDRESSES[currency?.chainId as number]
    : currency?.wrapped.address;
  return address;
};

type FilterPoolsParams = {
  TokenA: Currency | undefined;
  TokenB: Currency | undefined;
  liquidities: any[] | undefined;
};

export const filterPools = ({
  TokenA,
  TokenB,
  liquidities,
}: FilterPoolsParams) => {
  let tokenA = getAddress(TokenA);
  let tokenB = getAddress(TokenB);

  const data = liquidities?.filter(
    (liquidity) =>
      (liquidity.path[0].fromPath === tokenA &&
        liquidity.path[1].toPath === tokenB) ||
      (liquidity.path[0].fromPath === tokenB &&
        liquidity.path[1].toPath === tokenA)
  );
  return data;
};

interface ValueToBeRemovedArgs {
  pool: any;
  inputValue?: string;
}

export const useTokenValueToBeRemoved = ({
  pool,
  inputValue,
}: ValueToBeRemovedArgs) => {
  return useMemo(() => {
    // const percent = new Percent
    if (pool && inputValue) {
      const poolToken0Fraction =
        (pool.pooledToken0 / 100) * parseInt(inputValue);
      const poolToken1Fraction =
        (pool.pooledToken1 / 100) * parseInt(inputValue);

      const poolTokenFraction = (pool.poolToken / 100) * parseInt(inputValue);
      console.log(poolToken0Fraction, poolToken1Fraction, poolTokenFraction);
      return [poolToken0Fraction, poolToken1Fraction, poolTokenFraction];
    }
  }, [pool, inputValue]);
  // return [poolToken0Fraction, poolToken1Fraction, poolTokenFraction];
};
