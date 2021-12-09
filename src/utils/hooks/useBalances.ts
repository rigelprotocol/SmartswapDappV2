import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { provider, getERC20Token } from '../utilsFunctions';
import { ethers } from 'ethers';
import { SupportedChainSymbols,SupportedChainLogo,SupportedChainName } from '../constants/chains';
import { RGPADDRESSES } from '../addresses';
import {useSelector} from "react-redux";
import {RootState} from "../../state";




export const useNativeBalance = () => {
  const { account, chainId } = useWeb3React();
  const [Balance, setBalance] = useState<string>('');
  const [Symbol, setSymbol] = useState(SupportedChainSymbols[56]);
  const [Name, setName] = useState(SupportedChainName[56]);
  const [Logo, setLogo] = useState(SupportedChainLogo[56]);

  const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);

  const stateChanged : boolean = trxState === 2;

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
        setSymbol(SupportedChainSymbols[56]);
          setName(SupportedChainName[56]);
          setLogo(SupportedChainLogo[56]);
      }
    };
    getBalance();
  }, [account, chainId, stateChanged]);

  return [Balance, Symbol,Name,Logo];
};

export const useRGPBalance = () => {
  const { chainId, account } = useWeb3React();
  const [RGPBalance, setRGPBalance] = useState('');

  const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
  const stateChanged : boolean = trxState === 2;

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
  }, [account, chainId, stateChanged]);

  return [RGPBalance];
};

export const useTokenBalance = (address: string) => {
  const [balance, setBalance] = useState('');
 
  useEffect(() => {
    const getTokenAmount = async(tokenAddress: string) => {
      try {
        const Provider = await provider();
        const balance = await Provider?.getBalance(tokenAddress as string);
       
          setBalance(parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4))
     
      } catch (err) {
        console.log(err);
        return 0
      }
    };
    getTokenAmount(address)
  }, [address])

  return [balance]

}

export const getTokenAmount = async(tokenAddress: string) => {
  try {
    const Provider = await provider();
    const balance = await Provider?.getBalance(tokenAddress as string);
      return parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4)
 
  } catch (err) {
    console.log(err);
    return 0
  }
};
