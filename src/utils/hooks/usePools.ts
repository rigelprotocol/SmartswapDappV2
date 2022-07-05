import { useState, useEffect, useMemo } from "react";
import {
  smartFactory,
  LiquidityPairInstance,
  SmartSwapRouter,
} from "../Contracts";
import { SMARTSWAPFACTORYADDRESSES, SMARTSWAPROUTER } from "../addresses";
import { getERC20Token } from "../utilsFunctions";
import { ethers } from "ethers";
import { Currency, Fraction } from "@uniswap/sdk-core";
import { WNATIVEADDRESSES } from "../addresses";
import JSBI from "jsbi";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { Web3Provider} from '@ethersproject/providers'
import { convertFromWei } from "..";
import { GFindLiquidity } from "../../components/G-analytics/gLiquidity";

export const useGetUserLiquidities = async () => {
  const { account, chainId, library } = useActiveWeb3React();
  const [liquidities, setLiquidities] = useState<any[]>();
  const [liquidityLength, setLiquidityLength] = useState(0);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserPairs = async () => {
      if (account) {
        setLoading(true);
        try {
          const SmartFactory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number],
            library
          );
          const allLiquidityPairs = await SmartFactory.allPairsLength();
          const allExchange = await Promise.all(
            getAllPairs(allLiquidityPairs.toNumber(), SmartFactory.allPairs)
          );
          const pairsData = await Promise.all(
            allExchange.map((address) =>
              getPoolData(address, account, chainId as number, library)
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
  }, [chainId, account, library]);

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
  chainId: number,
  library: Web3Provider | undefined
) => {
  const liquidity = await LiquidityPairInstance(address, library);
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
    getERC20Token(token0, library),
    getERC20Token(token1, library),
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

  return {
    pairAddress: address,
    poolToken: ethers.utils.formatEther(balance),
    poolTokenWei: balance,
    totalSupplyWei: totalSupply,
    totalSupply: totalSupply.toString(),
    poolShare: (balance.toString() / totalSupply) * 100,
    path: [
      {
        fromPath: token0,
        token: symbol0,
        amount: pooledToken0[0],
        amountWei: pooledToken0[1],
        decimals: decimals0,
        reservesWei: reserves[0],
        multiplyreserves: pooledToken0[2],
      },
      {
        toPath: token1,
        token: symbol1,
        amount: pooledToken1[0],
        amountWei: pooledToken1[1],
        decimals: decimals1,
        reservesWei: reserves[1],
        multiplyreserves: pooledToken1[2],
      },
    ],
    pooledToken0: pooledToken0[0],
    pooledToken1: pooledToken1[0],
    approved: approved,
  };
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

  const finalWei = multiplyReserve.multiply(Decimal).toSignificant(18);

  const final = multiplyReserve.divide(Decimal);
  return [final.toSignificant(params.decimals), finalWei, multiplyReserve];
};

export const useGetLiquidityById = async (
  address1: string,
  address2: string,
  hasBeenApproved: boolean,
  loadData: boolean
) => {
  const { account, chainId, library } = useActiveWeb3React();
  const [loading, setLoading] = useState(true);
  const [LiquidityPairData, setLiquidityPairData] = useState<any>();
  const [approved, setApproved] = useState(false);

  useMemo(() => {
    const loadPair = async () => {
      if (account) {
        setLoading(true);
        try {
          const SmartFactory = await smartFactory(
            SMARTSWAPFACTORYADDRESSES[chainId as number],
            library
          );

          const Pair = await SmartFactory.getPair(address1, address2);
          const PairData = await getPoolData(
            Pair,
            account,
            chainId as number,
            library
          );
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
  return currency?.isNative
    ? WNATIVEADDRESSES[currency?.chainId as number]
    : currency?.wrapped.address;
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

  GFindLiquidity(tokenA,tokenB)
  return liquidities?.filter(
    (liquidity) =>
      (liquidity.path[0].fromPath === tokenA &&
        liquidity.path[1].toPath === tokenB) ||
      (liquidity.path[0].fromPath === tokenB &&
        liquidity.path[1].toPath === tokenA)
  );
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

      const pooltoken0quotient =
        pool.path[0].multiplyreserves.quotient.toString();
      const pooltoken1quotient =
        pool.path[1].multiplyreserves.quotient.toString();

      const fixpooltoken0 = JSBI.divide(
        JSBI.BigInt(pooltoken0quotient),
        JSBI.BigInt(100)
      );
      const fixpooltoken0Fraction = JSBI.multiply(
        fixpooltoken0,
        JSBI.BigInt(inputValue)
      ).toString();

      const poolToken1Fraction =
        (pool.pooledToken1 / 100) * parseInt(inputValue);

      const fixpooltoken1 = JSBI.divide(
        JSBI.BigInt(pooltoken1quotient),
        JSBI.BigInt(100)
      );
      const fixpooltoken1Fraction = JSBI.multiply(
        fixpooltoken1,
        JSBI.BigInt(inputValue)
      ).toString();

      const poolTokenFraction = (pool.poolToken / 100) * parseInt(inputValue);
      const fixToken = JSBI.divide(
        JSBI.BigInt(pool.poolTokenWei.toString()),
        JSBI.BigInt(100)
      );

      const fixTokenFraction =
        parseFloat(inputValue) === 100
          ? pool.poolTokenWei.toString()
          : JSBI.multiply(fixToken, JSBI.BigInt(inputValue)).toString();

      return [
        poolToken0Fraction,
        poolToken1Fraction,
        poolTokenFraction,
        fixpooltoken0Fraction,
        fixpooltoken1Fraction,
        fixTokenFraction,
      ];
    }
  }, [pool, inputValue]);
  // return [poolToken0Fraction, poolToken1Fraction, poolTokenFraction];
};

export const getNativeAddress = (address: string): string => {
  const isAddress = WNATIVEADDRESSES[address];
  return !isAddress ? address : isAddress;
};

export const useIsPoolsAvailable = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined
) => {
  const { chainId, account, library } = useActiveWeb3React();
  const [pairAvailable, setPairAvailable] = useState(false);
  useMemo(async () => {
    if (CurrencyA && CurrencyB && account) {
      const factory = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number],
        library
      );
      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);

      const pair = await factory.getPair(currencyAAddress, currencyBAddress);
      if (pair !== "0x0000000000000000000000000000000000000000") {
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
  const { chainId, account, library } = useActiveWeb3React();
  const [poolShare, setPoolShare] = useState(0);
  useMemo(async () => {
    if (account && CurrencyA && CurrencyB) {
      const factory = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number],
        library
      );

      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);
      const pair = await factory.getPair(currencyAAddress, currencyBAddress);
      if (pair !== "0x0000000000000000000000000000000000000000") {
        try {
          const LPInstance = await LiquidityPairInstance(pair, library);
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
  const { chainId, account, library } = useActiveWeb3React();
  const [priceAToB, setPriceAToB] = useState<string | undefined>(undefined);
  const [priceBToA, setPriceBToA] = useState<string | undefined>(undefined);

  useMemo(async () => {
    if (account && CurrencyA && CurrencyB) {
      const router = await SmartSwapRouter(
        SMARTSWAPROUTER[chainId as number],
        library
      );
      const factory = await smartFactory(
        SMARTSWAPFACTORYADDRESSES[chainId as number],
        library
      );

      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);
      const pair = await factory.getPair(currencyAAddress, currencyBAddress);

      if (pair !== "0x0000000000000000000000000000000000000000") {
        try {
          const pairinstance = await LiquidityPairInstance(pair, library);
          const reserves = await pairinstance.getReserves();
          const token0 = await pairinstance.token0();
          const token1 = await pairinstance.token1();

          const [PriceAToB, PriceBToA] = await Promise.all([
            router.quote(
              ethers.utils.parseUnits("1", CurrencyA.decimals),
              token0 === currencyAAddress ? reserves[0] : reserves[1],
              token0 === currencyAAddress ? reserves[1] : reserves[0]
            ),
            router.quote(
              ethers.utils.parseUnits("1", CurrencyB.decimals),
              token0 === currencyAAddress ? reserves[1] : reserves[0],
              token0 === currencyAAddress ? reserves[0] : reserves[1]
            ),
          ]);

          setPriceAToB(
            ethers.utils.formatUnits(PriceAToB.toString(), CurrencyB.decimals)
          );
          setPriceBToA(
            ethers.utils.formatUnits(PriceBToA.toString(), CurrencyA.decimals)
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
  checkTokenApproval: number,
  inputA:string,
  inputB:string
) => {
  const { account, chainId, library } = useActiveWeb3React();
  const [hasTokenABeenApproved, setHasTokenABeenApproved] = useState(false);
  const [hasTokenBBeenApproved, setHasTokenBBeenApproved] = useState(false);
  useMemo(async () => {
    if (CurrencyA && CurrencyB && account) {
      const currencyAAddress = getAddress(CurrencyA);
      const currencyBAddress = getAddress(CurrencyB);
      const [tokenA, tokenB] = await Promise.all([
        getERC20Token(currencyAAddress as string, library),
        getERC20Token(currencyBAddress as string, library),
      ]);

      const [allowanceA, allowanceB, decimalsA, decimalsB] = await Promise.all([
        tokenA.allowance(account, SMARTSWAPROUTER[chainId as number]),
        tokenB.allowance(account, SMARTSWAPROUTER[chainId as number]),
        tokenA.decimals(),
        tokenB.decimals()
      ]);

      const isTokenOneApproved = CurrencyA.isNative ? true :
          parseFloat(ethers.utils.formatUnits(allowanceA, decimalsA).toString()) > parseFloat(inputA);

      const isTokenTwoApproved = CurrencyB.isNative ? true :
          parseFloat(ethers.utils.formatUnits(allowanceB, decimalsB).toString()) > parseFloat(inputB);

      setHasTokenABeenApproved(isTokenOneApproved);
      setHasTokenBBeenApproved(isTokenTwoApproved);

    }
      
  }, [CurrencyB, CurrencyA, account, chainId, checkTokenApproval,inputA,inputB]);

  return { hasTokenABeenApproved, hasTokenBBeenApproved };
};

export const usePriceForNewPool = (
  inputA: string,
  inputB: string,
  pairExist: boolean
) => {
  const [priceAperB, setPriceAperB] = useState("");
  const [priceBperA, setPriceBperA] = useState("");
  useMemo(() => {
    if (!pairExist && inputA && inputB) {
      const priceA = parseFloat(inputB) / parseFloat(inputA);
      const priceB = parseFloat(inputA) / parseFloat(inputB);
      setPriceAperB(priceA.toString());
      setPriceBperA(priceB.toString());
    } else {
      setPriceBperA("");
      setPriceAperB("");
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
  return Math.min(
    (parseFloat(amounta) * parseFloat(totalsupply)) / parseFloat(reservesa),
    (parseFloat(amountb) * parseFloat(totalsupply)) / parseFloat(reservesb)
  );
};

const calculatePoolShare = (minted: number, totalSupply: string) => {
  const supply = ethers.utils.formatEther(totalSupply);
  const value = parseFloat(supply) + minted;
  return (minted / value) * 100;
};

export const useMintedLiquidity = (
  CurrencyA: Currency | undefined,
  CurrencyB: Currency | undefined,
  AmountA: string,
  AmountB: string
) => {
  const { chainId, account, library } = useActiveWeb3React();

  const [poolShare, setPoolShare] = useState("");
  const [minted, setMinted] = useState("");

  useMemo(async () => {
    if (account && CurrencyA && CurrencyB && AmountA && AmountB) {
      try {
        const addressA = getAddress(CurrencyA);
        const addressB = getAddress(CurrencyB);
        const factory = await smartFactory(
          SMARTSWAPFACTORYADDRESSES[chainId as number],
          library
        );

        const pair = await factory.getPair(addressA, addressB);
        const LPInstance = await LiquidityPairInstance(pair, library);
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
