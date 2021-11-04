import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>();
  const contextNetwork = useWeb3React<Web3Provider>('NETWORK');
  return context.active ? context : contextNetwork;
}
