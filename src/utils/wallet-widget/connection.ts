import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { notify } from '../../pages/NoticeProvider/actions';
import configureStore from '../../../configureStore';
import { WALLET_CONNECTED } from '../../pages/WalletProvider/constants';
import { formatBalance, convertFromWei } from '../utilsFunctions';
import { balanceAbi, decimalAbi } from '../constants';
const { store } = configureStore();

export const provider = async () => {
  try {
    let ethProvider = await detectEthereumProvider();
    if (ethProvider !== window.ethereum && window.ethereum !== 'undefined') {
      ethProvider = window.ethereum;
      return new ethers.providers.Web3Provider(ethProvider);
    }
    return new ethers.providers.Web3Provider(ethProvider);
  } catch (e) {
    return notify({
      title: 'System Error',
      body: 'You have not installed MetaMask Wallet',
      type: 'error',
    });
  }
};

export const signer = async () => (await provider()).getSigner();

export const connectMetaMask = async () =>
  await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

export const getAddressTokenBalance = async (
  address,
  tokenAddress,
  walletSigner,
) =>
  formatBalance(
    convertFromWei(
      await new ethers.Contract(
        tokenAddress,
        balanceAbi,
        walletSigner,
      ).balanceOf(address),
      await new ethers.Contract(
        tokenAddress,
        decimalAbi,
        walletSigner,
      ).decimals(),
    ),
  );
/**
 *
 * @param {*} wallet
 * @returns {*} dispatch
 */
export const connectionEventListener = wallet => dispatch => {
  if (
    window.ethereum.isConnected() &&
    window.ethereum.selectedAddress &&
    window.ethereum.isMetaMask
  ) {
    const reduxWallet = store.getStore().wallet;
    window.ethereum.on('connect', (...args) => {
      console.log('Hello>>> ', args);
      dispatch({
        type: WALLET_CONNECTED,
      });
    });
    window.ethereum.on('chainChanged', chainId => {
      dispatch({
        type: WALLET_CONNECTED,
        wallet: { ...reduxWallet, chainId },
      });
      console.log(chainId);
    });

    window.ethereum.on('accountsChanged', async accounts => {
      if (accounts.length === 0) {
        disconnectUser();
        console.log('>>> are you leaving');
      } else if (accounts[0] !== wallet.address) {
        const address = accounts[0];
      }
    });
    window.ethereum.on('disconnect', error => {
      disconnectUser();
    });
  }
  console.log('Hello All');
  return true;
};

export function disconnectUser() {}
// Object.fromEntries( Object.entries(TOKENS_CONTRACT).filter(([key, value]) => key === symbol))
export const setupNetwork = async () => {
  const walletProvider = window.ethereum;
  if (walletProvider !== undefined && walletProvider.isTrust) {
    const chainId = 38;
    const deviceChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    if (deviceChainId !== '0x38') {
      try {
        await walletProvider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString()}`,
              chainName: 'Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              blockExplorerUrls: ['https://bscscan.com/'],
            },
          ],
        });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};

const supportedNetworks = ['0x61', '0x38', 'chainId'];

export const isSupportedNetwork = chainId =>
  supportedNetworks.includes(chainId);

const checkMetamask = async () => {
  const provider = await detectEthereumProvider();
  return !!provider;
};

export const switchToBSC = async () => {
  if (checkMetamask()) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        addBSCToMetamask();
      }
      // handle other  errors codes
    }
  }
};

const addBSCToMetamask = async () => {
  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x38',
          chainName: 'Smart Chain',
          nativeCurrency: {
            name: 'BSC Mainet',
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com/'],
        },
      ],
    });
  } catch (addError) {
    console.log(addError);
  }
};
