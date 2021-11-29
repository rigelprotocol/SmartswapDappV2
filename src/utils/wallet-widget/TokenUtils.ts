/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
import { ethers } from 'ethers';
import { getAddressTokenBalance } from './connection';
import { formatBalance } from '../utilsFunctions';
import Web3 from 'web3';
import { approveAbi, allowanceAbi, SMART_SWAP } from '../constants';

export const getTokenListBalance = async (tokenList, account, checker) => {
  return tokenList.map(async (token, index) => {
    if (typeof token.address !== 'undefined' && account.signer !== 'signer') {
      const { signer } = account;
      let { balance, name, symbol, address } = token;
      balance = symbol === 'BNB' ? account.balance : await getAddressTokenBalance(account.address, address, signer);
      checker(true);
      return { balance, name, symbol, address };
    }
  });
};

export const approveToken = async (
  walletAddress,
  tokenAddress,
  walletSigner,
  amount,
) => {
  const walletBal = Number(amount) + 10;
  return await new ethers.Contract(
    tokenAddress,
    approveAbi,
    walletSigner,
  ).approve(SMART_SWAP.SMART_SWAPPING, Web3.utils.toWei(walletBal.toString()), {
    from: walletAddress,
  });
};

export const runApproveCheck = async (token, walletAddress, walletSigner) => {
  if (
    typeof token.address !== 'undefined' &&
    walletSigner !== 'signer' &&
    token.symbol !== 'ETH'
  ) {
    return formatBalance(
      ethers.utils.formatEther(
        await new ethers.Contract(
          token.address,
          allowanceAbi,
          walletSigner,
        ).allowance(walletAddress, SMART_SWAP.SMART_SWAPPING, {
          from: walletAddress,
        }),
      ),
    );
  }
};
