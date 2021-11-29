import { ethers } from 'ethers';
import RigelToken from './abis/RigelToken.json';
import masterChefV2 from './abis/masterChefV2.json';
import { SMART_SWAP, checkNetVersion } from './constants';
import wallet from '../pages/FarmingV2'
import { useActiveWeb3React } from './hooks/useActiveWeb3React'
import { useNativeBalance, useRGPBalance } from './hooks/useBalances';
import SmartSwapLPTokenOne from './abis/SmartSwapLPTokenOne.json';
import SmartSwapLPTokenTwo from './abis/SmartSwapLPTokenTwo.json';
import SmartSwapLPTokenThree from './abis/SmartSwapLPTokenThree.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const masterChefV2Contract = async () => new ethers.Contract(SMART_SWAP.masterChefV2, masterChefV2, signer);

// rigel token
export const rigelToken = async () => new ethers.Contract(SMART_SWAP.RigelSmartContract, RigelToken, signer);

export const smartSwapLPTokenPoolOne = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolOne,
    SmartSwapLPTokenOne,
    signer,
  );

export const smartSwapLPTokenPoolTwo = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolTwo,
    SmartSwapLPTokenTwo,
    signer,
  );

export const smartSwapLPTokenPoolThree = async () =>
  new ethers.Contract(
    SMART_SWAP.masterChefPoolThree,
    SmartSwapLPTokenThree,
    signer,
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
    signer,
  );
