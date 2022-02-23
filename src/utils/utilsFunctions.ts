import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import ERC20Token from "./abis/erc20.json";
import { SupportedChainSymbols, WrappedSymbols } from "./constants/chains";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

export const removeSideTab = (sideBarName: string): void => {
  localStorage.setItem(sideBarName, "removed");
};

export const checkSideTab = (sideBarName: string): boolean => {
  const isSidebarActive = localStorage.getItem(sideBarName);
  if (isSidebarActive === "removed") {
    return true;
  } else {
    return false;
  }
};

export const changeFrequencyTodays = (frequency: string): { days: number, today: number, month: number } => {
  let days = 1
  let date = new Date()
  let today = date.getDay()
  let month = date.getMonth()
  if (frequency === "daily") {
    return { days, today, month }
  } else if (frequency === "weekly") {
    days = 7
    today = date.getDate()
    return { days, today, month }
  } else if (frequency === "monthly") {
    days = 30
    today = date.getMonth()
    return { days, today, month }
  }
  return { days, today, month }
}

export const provider = async () => {
  try {
    let ethProvider = await detectEthereumProvider();
    if (ethProvider !== window.ethereum && window.ethereum !== "undefined") {
      ethProvider = window.ethereum;
      return new Web3Provider(ethProvider as any);
    }
    return new Web3Provider(ethProvider as any);
  } catch (e) {
    console.log("provider error", e);
  }
};

export const signer = async (library: Web3Provider | undefined) => {
  try {
    return await library?.getSigner();
  } catch (e) {
    console.log("provider error", e);
  }
};

export const getERC20Token = async (
  address: string,
  library: Web3Provider | undefined
) => {
  const token = new Contract(address, ERC20Token, library?.getSigner());
  return token;
};

export const getDecimals = async (
  address: string,
  library: Web3Provider | undefined
): Promise<number> => {
  const token = await getERC20Token(address, library);
  const decimals = await token.decimals();
  return decimals;
};

export const switchNetwork = async (
  chainId: string,
  account: string,
  library: Web3Provider | undefined
) => {
  const polygonParams = {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
  };
  const ropstenParams = {
    chainId: "0x3",
    chainName: "Ropsten Test Network",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://ropsten.etherscan.io"],
  };
  const binanceParams = {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  };
  const oasisParams = {
    chainId: "0xa516",
    chainName: "Emerald Mainnet",
    nativeCurrency: {
      name: "ROSE",
      symbol: "ROSE",
      decimals: 18,
    },
    rpcUrls: ["https://emerald.oasis.dev"],
    blockExplorerUrls: ["https://explorer.emerald.oasis.dev"],
  };
  if (chainId === "0x1") {
    library?.send("wallet_switchEthereumChain", [{ chainId }, account]);
  } else if (chainId === "0x3") {
    try {
      await library?.send("wallet_switchEthereumChain", [
        { chainId: "0x3" },
        account,
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library?.send("wallet_addEthereumChain", [
            ropstenParams,
            account,
          ]);
        } catch (addError) {
          // handle "add" error
          console.error(`Add chain error ${addError}`);
        }
      }
      console.error(`Switch chain error ${switchError}`);
      // handle other "switch" errors
    }
  } else if (chainId === "0x38") {
    try {
      await library?.send("wallet_switchEthereumChain", [
        { chainId: "0x38" },
        account,
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library?.send("wallet_addEthereumChain", [
            binanceParams,
            account,
          ]);
        } catch (addError) {
          // handle "add" error
          console.error(`Add chain error ${addError}`);
        }
      }
      console.error(`Switch chain error ${switchError}`);
      // handle other "switch" errors
    }
  } else if (chainId === "0x89") {
    try {
      await library?.send("wallet_switchEthereumChain", [
        { chainId: "0x89" },
        account,
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library?.send("wallet_addEthereumChain", [
            polygonParams,
            account,
          ]);
        } catch (addError) {
          // handle "add" error
          console.error(`Add chain error ${addError}`);
        }
      }
      console.error(`Switch chain error ${switchError}`);
      // handle other "switch" errors
    }
  } else if (chainId === "0xa516") {
    try {
      await library?.send("wallet_switchEthereumChain", [
        { chainId: "0xa516" },
        account,
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library?.send("wallet_addEthereumChain", [
            oasisParams,
            account,
          ]);
        } catch (addError) {
          // handle "add" error
          console.error(`Add chain error ${addError}`);
        }
      }
      console.error(`Switch chain error ${switchError}`);
      // handle other "switch" errors
    }
  }
};

export const getDeadline = (userDeadline: number) => {
  const time = Math.floor(new Date().getTime() / 1000 + userDeadline);
  return time;
};

export const isNative = (symbol: string, chainId: number): boolean => {
  if (symbol === WrappedSymbols[chainId as number]) {
    return true;
  } else {
    return false;
  }
};

export const ISNATIVE = (symbol: string, chainId: number): boolean => {
  if (symbol === SupportedChainSymbols[chainId as number]) {
    return true;
  } else {
    return false;
  }
};

export const formatAmountIn = (amount: any, decimals: number) => {
  return ethers.utils.parseUnits(truncate(amount, decimals), decimals);
};

export function truncate(str: string, maxDecimalDigits: number) {
  if (str && str.toString()?.includes(".")) {
    const parts = str.toString().split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
  }

  return str;
}
export const getOutPutDataFromEvent = async (
  tokenAddress,
  eventsArray,
  decimal
) => {
  const duplicateArray = [];
  eventsArray.map((event) => {
    if (event.address.toLowerCase() === tokenAddress.toLowerCase()) {
      duplicateArray.push(event);
    }
  });

  if (duplicateArray.length !== 0) {
    const convertedInput = (
      parseInt(duplicateArray[0].data, 16) /
      10 ** decimal
    ).toFixed(7);
    return convertedInput;
  }
};
