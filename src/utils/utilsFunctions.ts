import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import detectEthereumProvider from '@metamask/detect-provider';
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
