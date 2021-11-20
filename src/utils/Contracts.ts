import { provider } from './utilsFunctions';
import { Contract } from '@ethersproject/contracts';
import SmartFactory from './abis/SmartSwapFactoryForSwap.json';
import LiquidityPairAbi from './abis/smartSwapLPToken.json';
import SmartSwapRouterV2Abi from './abis/SmartSwapRouterV2.json';

export const smartFactory = async (address: string) => {
  const Provider = await provider();
  const smartFactory = new Contract(
    address,
    SmartFactory,
    Provider?.getSigner()
  );
  return smartFactory;
};

export const LiquidityPairInstance = async (address: string) => {
  const Provider = await provider();
  const LPInstance = new Contract(
    address,
    LiquidityPairAbi,
    Provider?.getSigner()
  );

  return LPInstance;
};

export const SmartSwapRouter = async (address: string) => {
  const Provider = await provider();
  const LPInstance = new Contract(
    address,
    SmartSwapRouterV2Abi,
    Provider?.getSigner()
  );

  return LPInstance;
};
