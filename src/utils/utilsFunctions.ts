import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import detectEthereumProvider from '@metamask/detect-provider';
import { getAddress } from '@ethersproject/address';
import ERC20Token from './abis/erc20.json';

export const removeSideTab = (sideBarName: string): void => {
  localStorage.setItem(sideBarName, 'removed');
};

export const checkSideTab = (sideBarName: string): Boolean => {
  const isSidebarActive = localStorage.getItem(sideBarName);
  if (isSidebarActive === 'removed') {
    return true;
  } else {
    return false;
  }
};

export const provider = async () => {
  try {
    let ethProvider = await detectEthereumProvider();
    if (ethProvider !== window.ethereum && window.ethereum !== 'undefined') {
      ethProvider = window.ethereum;
      return new Web3Provider(ethProvider as any);
    }
    return new Web3Provider(ethProvider as any);
  } catch (e) {
    console.log(e);
  }
};

export const getERC20Token = async (address: string) => {
  const Provider = await provider();
  const token = new Contract(address, ERC20Token, Provider);
  return token;
};

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}


