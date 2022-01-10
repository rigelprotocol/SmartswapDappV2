import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import detectEthereumProvider from '@metamask/detect-provider';
import { getAddress } from '@ethersproject/address';
import ERC20Token from './abis/erc20.json';
import { SupportedChainSymbols, WrappedSymbols } from './constants/chains';
import { Fraction } from '@uniswap/sdk-core';
import { ethers } from 'ethers';

export const removeSideTab = (sideBarName: string): void => {
  localStorage.setItem(sideBarName, 'removed');
};

export const checkSideTab = (sideBarName: string): boolean => {
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

    console.log("provider error",e);
  }
};

export const signer = async () => {
  try {
    const getProvider = await provider();
    const providerSigner = await getProvider?.getSigner()
    return providerSigner;
  } catch (e) {

    console.log("provider error",e);
  }
};

export const getERC20Token = async (address: string) => {
  const Provider = await provider();
  const token = new Contract(address, ERC20Token, Provider?.getSigner());
  return token;
};

export const switchNetwork = async (
  chainId: string,
  account: string,
  library: Web3Provider
) => {
  const polygonParams = {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  };
  const binanceParams = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  };

  if (chainId === '0x1') {
    library?.send('wallet_switchEthereumChain', [{ chainId }, account]);
  } else if (chainId === '0x38') {
    try {
      await library?.send('wallet_switchEthereumChain', [{ chainId: '0x38' }, account]);
    }catch (switchError) {
      if (switchError.code === 4902) {
          try {
            await library?.send('wallet_addEthereumChain', [binanceParams, account])
          } catch (addError) {
            // handle "add" error
            console.error(`Add chain error ${addError}`)
          }
        }
        console.error(`Switch chain error ${switchError}`)
      // handle other "switch" errors
    }
  } else if (chainId === '0x89') {
    try {
      await library?.send('wallet_switchEthereumChain', [{ chainId: '0x89' }, account]);
    }catch (switchError) {
      if (switchError.code === 4902) {
          try {
            await library?.send('wallet_addEthereumChain', [polygonParams, account])
          } catch (addError) {
            // handle "add" error
            console.error(`Add chain error ${addError}`)
          }
        }
        console.error(`Switch chain error ${switchError}`)
      // handle other "switch" errors
    }
  }
};

export const getDeadline = (userDeadline: number) => {
  const time = Math.floor(new Date().getTime() / 1000 + userDeadline);
  return time;
};

export const isNative = (symbol: string, chainId: number): boolean => {
  if (symbol === WrappedSymbols[chainId as number]) {
    return true;
  } else {
    return false;
  }
};

export const ISNATIVE = (symbol: string, chainId: number): boolean => {
  if (symbol === SupportedChainSymbols[chainId as number]) {
    return true;
  } else {
    return false;
  }
};

export const formatAmountIn = (amount: any, decimals: number) => {
  const Decimal = 10 ** decimals;
  const amountMin = amount * Decimal;
  return amountMin.toFixed();
};

export const getOutPutDataFromEvent = async (
  tokenAddress,
  eventsArray,
  decimal
) => {
  const duplicateArray = [];
  eventsArray.map((event) => {
    if (event.address.toLowerCase() === tokenAddress.toLowerCase()) {
      duplicateArray.push(event);
    }
  });

  if (duplicateArray.length !== 0) {
    const convertedInput = (
      parseInt(duplicateArray[0].data, 16) /
      10 ** decimal
    ).toFixed(7);
    return convertedInput;
  }
};
