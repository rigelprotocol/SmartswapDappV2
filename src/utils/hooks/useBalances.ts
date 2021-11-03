import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { provider, getERC20Token } from '../utilsFunctions';
import { ethers } from 'ethers';
import { SupportedChainSymbols,SupportedChainLogo,SupportedChainName } from '../constants/chains';
import { RGPADDRESSES } from '../addresses';

export const useNativeBalance = () => {
  const { account, chainId } = useWeb3React();
  const [Balance, setBalance] = useState<string>('');
  const [Symbol, setSymbol] = useState('');
  const [Name, setName] = useState('');
  const [Logo, setLogo] = useState('');

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        try {
          const Provider = await provider();
          const balance = await Provider?.getBalance(account as string);
          setBalance(
            parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4)
          );
          setSymbol(SupportedChainSymbols[chainId as number]);
          setName(SupportedChainName[chainId as number]);
          setLogo(SupportedChainLogo[chainId as number]);

        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('Connect wallet');
      }
    };
    getBalance();
  }, [account, chainId]);

  return [Balance, Symbol,Name,Logo];
};

export const useRGPBalance = () => {
  const { chainId, account } = useWeb3React();
  const [RGPBalance, setRGPBalance] = useState('');

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        try {
          const token = await getERC20Token(RGPADDRESSES[chainId as number]);
          const balance = await token.balanceOf(account);
          setRGPBalance(
            parseFloat(ethers.utils.formatEther(balance)).toFixed(4)
          );
        } catch (err) {
          setRGPBalance('');
          console.log(err);
        }
      } else {
        console.log('Connect wallet');
      }
    };

    getBalance();
  }, [account, chainId]);

  return [RGPBalance];
};
