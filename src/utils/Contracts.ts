import { Contract } from "@ethersproject/contracts";
import SmartFactory from "./abis/SmartSwapFactoryForSwap.json";
import LiquidityPairAbi from "./abis/smartSwapLPToken.json";
import SmartSwapRouterV2Abi from "./abis/SmartSwapRouterV2.json";
import masterChefV2 from "./abis/masterChefV2.json";
import masterChefNewLP from "./abis/masterchefNewLP.json";
import specialPool from "./abis/specialPool.json";
import specialPool2 from "./abis/specialPool2.json";
import { allowanceAbi, approveAbi } from "../constants";
import WETHABI from "./abis/WETH9.json";
import SmartSwapLPTokenABI1 from "./abis/LPToken1.json";
import SmartSwapLPTokenABI2 from "./abis/LPToken2.json";
import SmartSwapLPTokenABI3 from "./abis/SmartSwapLPTokenThree.json";
import ProductStakingABI from "./abis/ProductStaking.json";
import RigelToken from "./abis/RigelToken.json";
import {
  JsonRpcSigner,
  Web3Provider,
  JsonRpcProvider,
} from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import AUTOSWAPV2 from "./abis/autoswap.json";
import NFTAbi from "./abis/nft.json";
import NFTTwoAbi from "./abis/nftTwo.json";
import BidAbi from "./abis/smartBid.json";
import BidAbiTwo from "./abis/smartBidTwo.json";

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

//account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  provider: JsonRpcProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(provider, account) as any
  );
}
// AUTO SWAP TOKEN CONTRACT
export const autoSwapV2 = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, AUTOSWAPV2, library?.getSigner());
};
export const smartFactory = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, SmartFactory, signerOrProvider);
};

export const LiquidityPairInstance = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, LiquidityPairAbi, signerOrProvider);
};

export const SmartSwapRouter = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, SmartSwapRouterV2Abi, signerOrProvider);
};

export const ApprovalRouter = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, approveAbi, library?.getSigner());
};

export const ApproveCheck = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, allowanceAbi, library?.getSigner());
};

export const WETH = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, WETHABI, library?.getSigner());
};

export const MasterChefV2Contract = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, masterChefV2, signerOrProvider);
};

export const MasterChefNEWLPContract = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, masterChefNewLP, library?.getSigner());
};

export const RigelNFT = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, NFTAbi, signerOrProvider);
};

export const RigelNFTTwo = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, NFTTwoAbi, signerOrProvider);
};

export const RigelSmartBid = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, BidAbi, signerOrProvider);
};

export const RigelSmartBidTwo = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, BidAbiTwo, signerOrProvider);
};

// contract for special pool
export const RGPSpecialPool = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, specialPool, library?.getSigner());
};

// contract for special pool v2
export const RGPSpecialPool2 = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, specialPool2, library?.getSigner());
};
export const otherMarketPriceContract = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapRouterV2Abi, library?.getSigner());
};

//Liquuidity provider token contracts

export const smartSwapLPTokenPoolOne = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI1, library?.getSigner());
};

export const smartSwapLPTokenPoolTwo = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI2, library?.getSigner());
};

export const smartSwapLPTokenPoolThree = async (
  address: string,
  library: Web3Provider | JsonRpcProvider | undefined
) => {
  const type = library instanceof Web3Provider;
  const signerOrProvider = type ? library?.getSigner() : library;
  return new Contract(address, SmartSwapLPTokenABI3, signerOrProvider);
};
export const productStakingContract = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, ProductStakingABI, library?.getSigner());
};

export const smartSwapLPTokenV2PoolFour = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolFive = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolSix = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolSeven = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolEight = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolNine = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolTwelve = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const smartSwapLPTokenV2PoolThirteen = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};

export const rigelToken = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, RigelToken, library?.getSigner());
};

export const smartSwapLPTokenV2 = async (
  address: string,
  library: Web3Provider | undefined
) => {
  return new Contract(address, SmartSwapLPTokenABI3, library?.getSigner());
};
