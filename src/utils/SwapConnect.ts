/* eslint-disable react-hooks/rules-of-hooks */
import { ethers } from 'ethers';
import BUSD from './abis/BUSD.json';
import LiquidityPairAbi from './abis/smartSwapLPToken.json';
import RigelToken from './abis/RigelToken.json';
import ERC20Token from './abis/ERC20Token.json';
import SmartSwapFactoryForSwap from './abis/SmartSwapFactoryForSwap.json';
import SmartSwapRouter02 from './abis/SmartSwapRouter02.json';
import SmartSwapLPToken from './abis/smartSwapLPToken.json';
import ETHRGPSMARTSWAPPAIR from './abis/ETHRGPSMARTSWAPPAIR.json';
import masterChef from './abis/masterChef.json';
import masterChefV2 from './abis/masterChefV2.json';
import SmartSwapLPTokenOne from './abis/SmartSwapLPTokenOne.json';
import SmartSwapLPTokenTwo from './abis/SmartSwapLPTokenTwo.json';
import SmartSwapLPTokenThree from './abis/SmartSwapLPTokenThree.json';
import WETH9 from './abis/WETH9.json';
import lPContractABI from './abis/lPContractABI.json';
import specialPool from './abis/specialPool.json';
import configureStore from '../configureStore';
import { SMART_SWAP, checkNetVersion } from './constants';

const { store } = configureStore();
export const getProvider = () => {
  try {
    return new ethers.providers.Web3Provider(window.ethereum);
  } catch (Exception) {}
};
export const getSigner = () => {
  try {
    const { wallet } = store.getState().wallet;
    let { signer } = wallet;
    if (typeof signer === 'string') {
      if (window.ethereum && window.ethereum !== 'undefined') {
        signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      }
    }
    return signer;
  } catch (e) {}
};

// ----------------------------------------------------------------- LIVE DEPLOYMENT CONTRACT -----------------------------------------

//
// router contract where trx is made for both liquidity and swap
export const router = async () =>
  new ethers.Contract(
    SMART_SWAP.SMART_SWAPPING,
    SmartSwapRouter02,
    getSigner(),
  );
export const updateOutPutAmountForRouter = async () =>
  new ethers.Contract(
    SMART_SWAP.SMART_SWAPPING,
    SmartSwapRouter02,
    getSigner(),
  );

export const masterChefContract = async () => new ethers.Contract(SMART_SWAP.masterChef, masterChef, getSigner());

export const masterChefV2Contract = async () => new ethers.Contract(SMART_SWAP.masterChefV2, masterChefV2, getSigner());

export const smartSwapLPTokenPoolOne = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolOne,
    SmartSwapLPTokenOne,
    getSigner(),
  );

export const smartSwapLPTokenPoolTwo = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolTwo,
    SmartSwapLPTokenTwo,
    getSigner(),
  );

export const smartSwapLPTokenPoolThree = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolThree,
    SmartSwapLPTokenThree,
    getSigner(),
  );
export const smartSwapLPTokenV2PoolFour = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefV2PoolFour,
    SmartSwapLPTokenThree,
    getSigner(),
  );
export const smartSwapLPTokenV2PoolFive = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefV2PoolFive,
    SmartSwapLPTokenThree,
    getSigner(),
  );

// router contract where trx is made for both liquidity and swap
export const smartSwapLPToken = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolOne,
    SmartSwapLPToken,
    getSigner(),
  );

  // router contract where trx is made for both liquidity and swap
export const smartSwapV2LPToken = async () =>
new ethers.Contract(
  SMART_SWAP.masterChefV2PoolOne,
  SmartSwapLPToken,
  getSigner(),
);

export const smartSwapV2Token = async () =>
new ethers.Contract(
  SMART_SWAP.masterChefV2,
  SmartSwapLPToken,
  getSigner(),
);

// contract for LPs tokens
export const BNBRGPliquidityProviderTokensContract = async () =>
  new ethers.Contract(
    SMART_SWAP.liquidityProviderTokensContractBNBRGP,
    lPContractABI,
    getSigner(),
  );

// Factory smartContract for getting and creating pairs
export const SmartFactory = async () =>
  new ethers.Contract(
    SMART_SWAP.SmartFactory,
    SmartSwapFactoryForSwap,
    getSigner(),
  );

// rigel token
export const rigelToken = async () =>
  new ethers.Contract(SMART_SWAP.RigelSmartContract, RigelToken, getSigner());

// BUSD token
export const BUSDToken = async () =>
  new ethers.Contract(SMART_SWAP.BUSD, BUSD, getSigner());

// this can be used
// BNB token
export const BNBTOKEN = async () =>
  new ethers.Contract(SMART_SWAP.BNB, BUSD, getSigner());

// WETH (ETH)
export const WETH = async () => {
  const WETH9Address =
    checkNetVersion() == 56
      ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
      : '0x23967E68bB6FeA03fcc3676F8E55272106F44A4A';
  return new ethers.Contract(WETH9Address, WETH9, getSigner());
};

// Factory smartContract for getting and creating pairs for ETH and RGP
export const SMARTFACTORYPAIRETHRGP = async () =>
  new ethers.Contract(
    SMART_SWAP.ETHRGPSMARTSWAPPAIR,
    ETHRGPSMARTSWAPPAIR,
    getSigner(),
  );

// ----------------------------------------------------------------- LIVE DEPLOYMENT CONTRACTS -------------------------------------------------------

// contract for special pool
export const RGPSpecialPool = async () =>
  new ethers.Contract(SMART_SWAP.specialPool, specialPool, getSigner());

// Creates LiquidityPair Contract instance
export const LiquidityPairInstance = async address =>
  new ethers.Contract(address, LiquidityPairAbi, getSigner());

// Create instance for interacting with any ERC20 TOKEN
export const erc20Token = async address =>
  new ethers.Contract(address, RigelToken, getSigner());

// Creates an instance of any LPToken contract given an address
export const LPTokenContract = async lpTokenAddress =>
  new ethers.Contract(lpTokenAddress, SmartSwapLPToken, getSigner());
