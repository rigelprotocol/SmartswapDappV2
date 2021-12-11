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
      {
        fromPath: token0,
        token: symbol0,
        amount: pooledToken0,
        decimals: decimals0,
      },
      {
        toPath: token1,
        token: symbol1,
        amount: pooledToken1,
        decimals: decimals1,
      },
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
  hasBeenApproved: boolean,
  loadData: boolean
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
  }, [account, chainId, address1, address2, hasBeenApproved, loadData]);
  return { LiquidityPairData, loading, approved };
};

export const getAddress = (currency: Currency | undefined) => {
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
      return [poolToken0Fraction, poolToken1Fraction, poolTokenFraction];
    }
  }, [pool, inputValue]);
  // return [poolToken0Fraction, poolToken1Fraction, poolTokenFraction];
};

export const useIsPoolsAvailable = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined
) => {
  const { chainId, account } = useWeb3React();
  const [pairAvailable, setPairAvailable] = useState(false);
  useMemo(async () => {
    if (CurrencyA && CurrencyB && account) {
      const factory = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number]
      );
      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);

      const pair = await factory.getPair(currencyAAddress, currencyBAddress);
      if (pair !== '0x0000000000000000000000000000000000000000') {
        setPairAvailable(true);
      } else {
        setPairAvailable(false);
      }
    }
  }, [CurrencyA, CurrencyB, chainId, account]);
  return { pairAvailable };
};

export const usePoolShare = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined
) => {
  const { chainId, account } = useWeb3React();
  const [poolShare, setPoolShare] = useState(0);
  useMemo(async () => {
    if (account && CurrencyA && CurrencyB) {
      const factory = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number]
      );

      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);
      const pair = await factory.getPair(currencyAAddress, currencyBAddress);
      if (pair !== '0x0000000000000000000000000000000000000000') {
        try {
          const LPInstance = await LiquidityPairInstance(pair);
          const [balance, totalSupply] = await Promise.all([
            LPInstance.balanceOf(account),
            LPInstance.totalSupply(),
          ]);
          setPoolShare((balance.toString() / totalSupply) * 100);
        } catch (err) {
          console.log(err);
          setPoolShare(0);
        }
        // setPairAvailable(true);
      } else {
        // setPairAvailable(false);
        setPoolShare(0);
      }
    }
  }, [chainId, account, CurrencyA, CurrencyB]);
  return { poolShare };
};

export const usePricePerToken = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined
) => {
  const { chainId, account } = useWeb3React();
  const [priceAToB, setPriceAToB] = useState<string | undefined>(undefined);
  const [priceBToA, setPriceBToA] = useState<string | undefined>(undefined);

  useMemo(async () => {
    if (account && CurrencyA && CurrencyB) {
      const router = await SmartSwapRouter(SMARTSWAPROUTER[chainId as number]);
      const factory = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number]
      );
      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);
      const pair = await factory.getPair(currencyAAddress, currencyBAddress);

      if (pair !== '0x0000000000000000000000000000000000000000') {
        try {
          const [PriceAToB, PriceBToA] = await Promise.all([
            router.getAmountsOut(ethers.utils.parseEther('1'), [
              currencyAAddress,
              currencyBAddress,
            ]),
            router.getAmountsOut(ethers.utils.parseEther('1'), [
              currencyBAddress,
              currencyAAddress,
            ]),
          ]);

          setPriceAToB(
            ethers.utils.formatEther(PriceAToB.toString().split(',')[1])
          );
          setPriceBToA(
            ethers.utils.formatEther(PriceBToA.toString().split(',')[1])
          );
        } catch (err) {
          setPriceAToB(undefined);
          setPriceBToA(undefined);
        }
      } else {
        setPriceAToB(undefined);
        setPriceBToA(undefined);
      }
    }
  }, [account, CurrencyA, CurrencyB, chainId]);
  return { priceAToB, priceBToA };
};

export const useAllowance = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined,
  checkTokenApproval: boolean
) => {
  const { account, chainId } = useWeb3React();
  const [hasTokenABeenApproved, setHasTokenABeenApproved] = useState(false);
  const [hasTokenBBeenApproved, setHasTokenBBeenApproved] = useState(false);
  useMemo(async () => {
    if (CurrencyA && CurrencyB && account) {
      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);
      const [tokenA, tokenB] = await Promise.all([
        getERC20Token(currencyAAddress as string),
        getERC20Token(currencyBAddress as string),
      ]);

      const [allowanceA, allowanceB] = await Promise.all([
        tokenA.allowance(account, SMARTSWAPROUTER[chainId as number]),
        tokenB.allowance(account, SMARTSWAPROUTER[chainId as number]),
      ]);

      const isTokenAApproved = CurrencyA.isNative
        ? true
        : allowanceA.toString() > 0;

      const isTokenBApproved = CurrencyB.isNative
        ? true
        : allowanceB.toString() > 0;

      // console.log(isTokenAApproved, isTokenBApproved);
      setHasTokenABeenApproved(isTokenAApproved);
      setHasTokenBBeenApproved(isTokenBApproved);
    }
  }, [CurrencyB, CurrencyA, account, chainId, checkTokenApproval]);

  return { hasTokenABeenApproved, hasTokenBBeenApproved };
};

export const usePriceForNewPool = (
  inputA: string,
  inputB: string,
  pairExist: boolean
) => {
  const [priceAperB, setPriceAperB] = useState('');
  const [priceBperA, setPriceBperA] = useState('');
  useMemo(() => {
    if (!pairExist && inputA && inputB) {
      const priceA = parseFloat(inputB) / parseFloat(inputA);
      const priceB = parseFloat(inputA) / parseFloat(inputB);
      setPriceAperB(priceA.toString());
      setPriceBperA(priceB.toString());
    } else {
      setPriceBperA('');
      setPriceAperB('');
    }
  }, [pairExist, inputA, inputB]);

  return { priceAperB, priceBperA };
};

const calculateTokenToBeMinted = (
  reservesa: string,
  reservesb: string,
  totalsupply: string,
  amounta: string,
  amountb: string
) => {
  const minted = Math.min(
    (parseFloat(amounta) * parseFloat(totalsupply)) / parseFloat(reservesa),
    (parseFloat(amountb) * parseFloat(totalsupply)) / parseFloat(reservesb)
  );
  return minted;
};

const calculatePoolShare = (minted: number, totalSupply: string) => {
  const supply = ethers.utils.formatEther(totalSupply);
  const value = parseFloat(supply) + minted;
  const poolshare = (minted / value) * 100;
  return poolshare;
};

export const useMintedLiquidity = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined,
  AmountA: string,
  AmountB: string
) => {
  const { chainId, account } = useWeb3React();
  const [poolShare, setPoolShare] = useState('');
  const [minted, setMinted] = useState('');

  useMemo(async () => {
    if (account && CurrencyA && CurrencyB && AmountA && AmountB) {
      try {
        const addressA = getAddress(CurrencyA);
        const addressB = getAddress(CurrencyB);
        const factory = await smartFactory(
          SMARTSWAPFACTORYADDRESSES[chainId as number]
        );

        const pair = await factory.getPair(addressA, addressB);
        const LPInstance = await LiquidityPairInstance(pair);
        const reserves = await LPInstance.getReserves();
        const totalSupply = await LPInstance.totalSupply();
        const minted = calculateTokenToBeMinted(
          reserves[0].toString(),
          reserves[1].toString(),
          totalSupply,
          AmountA,
          AmountB
        );

        const poolshare = calculatePoolShare(minted, totalSupply.toString());

        setMinted(minted.toString());
        setPoolShare(poolshare.toString());
      } catch (err) {
        console.log(err);
      }
    }
  }, [account, CurrencyA, CurrencyB, AmountA, AmountB, chainId]);
  return { minted, poolShare };
};
