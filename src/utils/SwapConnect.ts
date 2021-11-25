import { ethers } from 'ethers';
import RigelToken from './abis/RigelToken.json';
import masterChefV2 from './abis/masterChefV2.json';
import configureStore from '../configureStore';
import { save, load } from 'redux-localstorage-simple'
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

export const masterChefV2Contract = async () => new ethers.Contract(SMART_SWAP.masterChefV2, masterChefV2, getSigner());

export const rigelToken = async () => new ethers.Contract(SMART_SWAP.RigelSmartContract, RigelToken, getSigner());
