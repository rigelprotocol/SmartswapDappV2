import JSBI from "jsbi";
import { useActiveWeb3React } from "../hooks/useActiveWeb3React";

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 BNB
export const checkNetVersion = () => {
  if (window.ethereum && window.ethereum.chainId !== null) {
    return window.ethereum.chainId.toString();
  }
  return null;
};
export const INITIAL_ALLOWED_SLIPPAGE = 100;
export const INITIAL_GASPRICE_INCREASE = (): number => {
  if (checkNetVersion() == "0x89") {
    return 40;
  } else {
    return 0;
  }
};

export const INITIAL_GAS = checkNetVersion() == "0x89" ?15 : 0;

const BSC_MAIN_NET_ID =
  window.ethereum !== undefined && window.ethereum.isTrust ? "56" : "0x38";

const BSCMainnet = {
  SmartFactory: "0x655333A1cD74232C404049AF9d2d6cF1244E71F6",
  SMART_SWAPPING: "0xf78234E21f1F34c4D8f65faF1BC82bfc0fa24920",
  ETHRGPSMARTSWAPPAIR: "0x9218BFB996A9385C3b9633f87e9D68304Ef5a1e5",
  specialPool: "0x100514759DCD6e2Ccbb9EB87481b96de28C4b77F",
  SmartSwap_LP_Token: "0x7f91f8B8Dac13DAc386058C12113936987F6Be9d",
  RigelSmartContract: "0xFA262F303Aa244f9CC66f312F0755d89C3793192",
  masterChef: "0x7d59AAD43Cef13Cd077308D37C3A39D3b4B6C924",
  masterChefV2: "0xE1ECCCcb46755a38D218Bf7Fdcd6f26C2cd7671f",
  masterChefPoolOne: "0x7f91f8B8Dac13DAc386058C12113936987F6Be9d",
  masterChefV2PoolOne: "0x7f91f8B8Dac13DAc386058C12113936987F6Be9d",
  masterChefPoolTwo: "0x9218BFB996A9385C3b9633f87e9D68304Ef5a1e5",
  masterChefPoolThree: "0xC8e6305376404Df37b9D231511cD27184fa8f10A",
  masterChefV2PoolFour: "0x3b087F8a582090A51BED1BCa1A5Ad1859ea14cA4",
  masterChefV2PoolFive: "0xF69f02FD07173CEB87808088e791F192fCCf1187",
  masterChefV2PoolSix: "0xF69f02FD07173CEB87808088e791F192fCCf1187",
  BNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  ETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  AXS: "0x715d400f88c167884bbcc41c5fea407ed4d2f8a0",
};

const BSCTestnet = {
  SmartFactory: "0x7B14Ab51fAF91926a2214c91Ce9CDaB5C0E1A1c3",
  SMART_SWAPPING: "0x00749e00Af4359Df5e8C156aF6dfbDf30dD53F44",
  ETHRGPSMARTSWAPPAIR: "0xca01606438556b299005b36B86B38Fe506eadF9F",
  specialPool: "0x7fE2Ec631716FeF3657BcB8d80CffBB2A34F7617",
  RigelSmartContract: "0x9f0227A21987c1fFab1785BA3eBa60578eC1501B",
  masterChef: "0x71C07230dF8b60aef6e3821CA2Dee530966EFc2D",
  masterChefV2: "0x1F5DABb92Aba96928d12e405D66275E20c53D846",
  masterChefPoolOne: "0x0B0a1E07931bD7991a104218eE15BAA682c05e01",
  masterChefV2PoolOne: "0x0B0a1E07931bD7991a104218eE15BAA682c05e01",
  masterChefPoolTwo: "0xca01606438556b299005b36B86B38Fe506eadF9F",
  masterChefPoolThree: "0x120f3E6908899Af930715ee598BE013016cde8A5",
  masterChefV2PoolFour: "0x30d8621d919b69c0D7920A7dC8936d457F3f8965",
  masterChefV2PoolFive: "0x816b823d9C7F30327B2c626DEe4aD731Dc9D3641",
  masterChefV2PoolSix: "0x816b823d9C7F30327B2c626DEe4aD731Dc9D3641",
  BNB: "0x23967E68bB6FeA03fcc3676F8E55272106F44A4A",
  BUSD: "0x10249e900b919fdee9e2ed38b4cd83c4df857254",
  ETH: "0x23967E68bB6FeA03fcc3676F8E55272106F44A4A",
  AXS: "0x6b9a9df1e6a29f17bfc79040a8f505aaa8866b6e",
};
export const SMART_SWAP =
  checkNetVersion() === BSC_MAIN_NET_ID.toString() ? BSCMainnet : BSCTestnet;
