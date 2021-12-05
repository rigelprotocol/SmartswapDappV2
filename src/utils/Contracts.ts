import { provider } from './utilsFunctions';
import { Contract } from '@ethersproject/contracts';
import SmartFactory from './abis/SmartSwapFactoryForSwap.json';
import LiquidityPairAbi from './abis/smartSwapLPToken.json';
import SmartSwapRouterV2Abi from './abis/SmartSwapRouterV2.json';
import masterChefV2 from './abis/masterChefV2.json'
import specialPool from './abis/specialPool.json'
import {approveAbi, allowanceAbi} from "../constants";
import WETHABI from './abis/WETH9.json';


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
  const SwapInstance = new Contract(
    address,
    SmartSwapRouterV2Abi,
    Provider?.getSigner()
  );

  return SwapInstance;
};

export const ApprovalRouter = async (address: string) => {
  const Provider = await provider();
  const ApprovalInstance = new Contract(
      address,
      approveAbi,
      Provider?.getSigner()
  );

  return ApprovalInstance;
};


export const ApproveCheck = async (address: string) => {
  const Provider = await provider();
  const CheckApproval = new Contract(
      address,
      allowanceAbi,
      Provider?.getSigner()
  );

  return CheckApproval;
};


export const WETH = async (address: string) => {
  const  Provider = await provider();
  const WETHInstance = new Contract(address, WETHABI, Provider?.getSigner());

  return WETHInstance;

};

export const MasterChefV2Contract = async (address: string) => {
  const Provider = await provider();
  const MasterChefV2Instance = new Contract(
      address,
      masterChefV2,
      Provider?.getSigner()
  );

  return MasterChefV2Instance;
};



// contract for special pool
export const RGPSpecialPool = async (address: string) => {
  const Provider = await provider();
  const RGPSpecialPoolInstance = new Contract(
      address,
      specialPool,
      Provider?.getSigner()
  );

  return RGPSpecialPoolInstance;
};
