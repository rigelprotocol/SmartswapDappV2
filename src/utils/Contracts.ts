import {Contract} from '@ethersproject/contracts';
import SmartFactory from './abis/SmartSwapFactoryForSwap.json';
import LiquidityPairAbi from './abis/smartSwapLPToken.json';
import SmartSwapRouterV2Abi from './abis/SmartSwapRouterV2.json';
import masterChefV2 from './abis/masterChefV2.json'
import specialPool from './abis/specialPool.json'
import {allowanceAbi, approveAbi} from "../constants";
import WETHABI from './abis/WETH9.json';
import SmartSwapLPTokenABI1 from './abis/LPToken1.json'
import SmartSwapLPTokenABI2 from './abis/LPToken2.json'
import SmartSwapLPTokenABI3 from './abis/SmartSwapLPTokenThree.json'
import RigelToken from './abis/RigelToken.json'
import {JsonRpcSigner, Web3Provider} from '@ethersproject/providers'
import {AddressZero} from '@ethersproject/constants'
import {getAddress} from '@ethersproject/address'


export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}


export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}



export const smartFactory = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartFactory,
      library?.getSigner()
  );
};

export const LiquidityPairInstance = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      LiquidityPairAbi,
      library?.getSigner()
  );
};

export const SmartSwapRouter = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapRouterV2Abi,
      library?.getSigner()
  );
};

export const ApprovalRouter = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      approveAbi,
      library?.getSigner()
  );
};


export const ApproveCheck = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      allowanceAbi,
      library?.getSigner()
  );
};


export const WETH = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(address, WETHABI, library?.getSigner());

};

export const MasterChefV2Contract = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      masterChefV2,
      library?.getSigner()
  );
};



// contract for special pool
export const RGPSpecialPool = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      specialPool,
      library?.getSigner()
  );
};

//Liquuidity provider token contracts

export const smartSwapLPTokenPoolOne = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapLPTokenABI1,
      library?.getSigner()
  );
};


export const smartSwapLPTokenPoolTwo = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapLPTokenABI2,
      library?.getSigner()
  );
};

export const smartSwapLPTokenPoolThree = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapLPTokenABI3,
      library?.getSigner()
  );
};

export const smartSwapLPTokenV2PoolFour = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapLPTokenABI3,
      library?.getSigner()
  );
};

export const smartSwapLPTokenV2PoolFive = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapLPTokenABI3,
      library?.getSigner()
  );
};

export const rigelToken = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      RigelToken,
      library?.getSigner()
  );
};

export const smartSwapLPTokenV2 = async (address: string, library: Web3Provider | undefined) => {
  return new Contract(
      address,
      SmartSwapLPTokenABI3,
      library?.getSigner()
  );
};
