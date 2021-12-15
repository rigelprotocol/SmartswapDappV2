import { provider } from './utilsFunctions';
import { Contract } from '@ethersproject/contracts';
import SmartFactory from './abis/SmartSwapFactoryForSwap.json';
import LiquidityPairAbi from './abis/smartSwapLPToken.json';
import SmartSwapRouterV2Abi from './abis/SmartSwapRouterV2.json';
import masterChefV2 from './abis/masterChefV2.json'
import specialPool from './abis/specialPool.json'
import {approveAbi, allowanceAbi} from "../constants";
import WETHABI from './abis/WETH9.json';
import SmartSwapLPTokenABI1 from './abis/LPToken1.json'
import SmartSwapLPTokenABI2 from './abis/LPToken2.json'
import SmartSwapLPTokenABI3 from './abis/SmartSwapLPTokenThree.json'
import RigelToken from './abis/RigelToken.json'

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

//Liquuidity provider token contracts

export const smartSwapLPTokenPoolOne = async (address: string) => {
  const Provider = await provider();
  const smartSwapLPTokenPoolOneInstance = new Contract(
      address,
      SmartSwapLPTokenABI1,
      Provider?.getSigner()
  );

  return smartSwapLPTokenPoolOneInstance;
};


export const smartSwapLPTokenPoolTwo = async (address: string) => {
  const Provider = await provider();
  const smartSwapLPTokenPoolTwoInstance = new Contract(
      address,
      SmartSwapLPTokenABI2,
      Provider?.getSigner()
  );

  return smartSwapLPTokenPoolTwoInstance;
};

export const smartSwapLPTokenPoolThree = async (address: string) => {
  const Provider = await provider();
  const smartSwapLPTokenPoolThreeInstance = new Contract(
      address,
      SmartSwapLPTokenABI3,
      Provider?.getSigner()
  );

  return smartSwapLPTokenPoolThreeInstance;
};

export const smartSwapLPTokenV2PoolFour = async (address: string) => {
  const Provider = await provider();
  const smartSwapLPTokenV2PoolFourInstance = new Contract(
      address,
      SmartSwapLPTokenABI3,
      Provider?.getSigner()
  );

  return smartSwapLPTokenV2PoolFourInstance;
};

export const smartSwapLPTokenV2PoolFive = async (address: string) => {
  const Provider = await provider();
  const smartSwapLPTokenV2PoolFiveInstance = new Contract(
      address,
      SmartSwapLPTokenABI3,
      Provider?.getSigner()
  );

  return smartSwapLPTokenV2PoolFiveInstance;
};

export const rigelToken = async (address: string) => {
  const Provider = await provider();
  const rigelTokenInstance = new Contract(
      address,
      RigelToken,
      Provider?.getSigner()
  );

  return rigelTokenInstance;
};


