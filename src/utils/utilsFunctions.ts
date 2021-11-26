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

export const switchNetwork = async (
  chainId: string,
  account: string,
  library: Web3Provider
) => {
  if (chainId === '0x1') {
    library?.send('wallet_switchEthereumChain', [{ chainId }, account]);
  } else if (chainId === '0x38') {
    library?.send('wallet_addEthereumChain', [
      {
        chainId: '0x38',
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
      account,
    ]);
  } else if (chainId === '0x89') {
    library?.send('wallet_addEthereumChain', [
      {
        chainId: '0x89',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
      account,
    ]);
  }
};

export const getSelectedTokenDetails = symbol =>
  tokenDetails.length > 0 &&
  symbol !== null &&
  tokenDetails.filter(
    fields => fields.symbol.toUpperCase() === symbol.toUpperCase(),
  )[0];

  export const formatBalance = balance => {
    if (balance.toString().includes('.')) {
      return `${balance.toString().split('.')[0]}.${balance
        .toString()
        .split('.')[1]
        .substr(0, 4)}`;
    }
    return parseFloat(balance)
      .toFixed(4)
      .toString();
  };

  export const convertFromWei = (balance, decimals) => {
    const decimalValue = decimals || 18;
    const { unitMap } = Web3.utils;
    const unit = Object.keys(unitMap).find(
      unit => unitMap[unit] === Math.pow(10, decimalValue).toString(),
    );
    return Web3.utils.fromWei(balance.toString(), unit);
  };

  export const convertToWei = (balance, decimals) => {
    const decimalValue = decimals || 18;
    const { unitMap } = Web3.utils;
    const unit = Object.keys(unitMap).find(
      unit => unitMap[unit] === Math.pow(10, decimalValue).toString(),
    );
    return Web3.utils.toWei(balance.toString(), unit);
  };

  export function mergeArrays(arrays) {
    let jointArray = [];
    arrays.forEach(array => {
      jointArray = [...jointArray, ...array];
    });
    let updatedArray = jointArray.filter(
      (thing, index, self) =>
        index === self.findIndex(t => t.symbol === thing.symbol),
    );
    updatedArray = updatedArray.map((token, id) => {
      const balance = null;
      const available = true;
      const imported = !!token.imported;
      return { ...token, id, balance, available, imported };
    });
    return updatedArray.filter(token => token.symbol !== 'SELECT A TOKEN');
  };

  export const isNotEmpty = objectToCheck =>
    objectToCheck &&
    Object.keys(objectToCheck).length === 0 &&
    objectToCheck.constructor === Object;

  export const changeTransactionDeadline = val => {
    if (val === '' || val < 0) {
      const time = Math.floor(new Date().getTime() / 1000.0 + 1200);
      return time;
    }
  };
