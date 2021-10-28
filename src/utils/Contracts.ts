import { provider } from './utilsFunctions';
import { Contract } from '@ethersproject/contracts';
import SmartFactory from './abis/SmartSwapFactoryForSwap.json';
import LiquidityPairAbi from './abis/smartSwapLPToken.json';

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
