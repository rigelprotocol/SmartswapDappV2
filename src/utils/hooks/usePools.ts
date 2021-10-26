import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { smartFactory, LiquidityPairInstance } from '../Contracts';
import { SMARTSWAPFACTORYADDRESSES } from '../addresses';
import { getERC20Token } from '../utilsFunctions';
import { ethers } from 'ethers';

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
            allExchange.map((address) => getPoolData(address, account))
          );
          const userPairs = pairsData.filter(
            (pair) => parseFloat(pair.poolToken) !== 0
          );
          setLiquidities(userPairs);
          setLiquidityLength(userPairs.length);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLiquidities([]);
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

const getPoolData = async (address: string, account: string) => {
  const liquidity = await LiquidityPairInstance(address);
  const [balance, totalSupply, reserves, token0, token1] = await Promise.all([
    liquidity.balanceOf(account),
    liquidity.totalSupply(),
    liquidity.getReserves(),
    liquidity.token0(),
    liquidity.token1(),
  ]);
  const [erc20Token0, erc20Token1] = await Promise.all([
    getERC20Token(token0),
    getERC20Token(token1),
  ]);
  const [symbol0, symbol1] = await Promise.all([
    erc20Token0.symbol(),
    erc20Token1.symbol(),
  ]);
  const pooledToken0 = ((balance / totalSupply) * reserves[0]) / 1e18;
  const pooledToken1 = ((balance / totalSupply) * reserves[1]) / 1e18;

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
  };
  return liquidityObject;
};
