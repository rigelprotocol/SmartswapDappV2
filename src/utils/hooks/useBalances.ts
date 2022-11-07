import { useEffect, useState } from "react";
import { getERC20Token } from "../utilsFunctions";
import { ethers } from "ethers";
import {
  SupportedChainSymbols,
  SupportedChainLogo,
  SupportedChainName,
} from "../constants/chains";
import { RGPADDRESSES } from "../addresses";
import { useSelector } from "react-redux";
import { RootState } from "../../state";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { Web3Provider } from "@ethersproject/providers";

export const useNativeBalance = () => {
  const { account, chainId, library } = useActiveWeb3React();
  const [Balance, setBalance] = useState<string>("");
  const [Symbol, setSymbol] = useState(SupportedChainSymbols[56]);
  const [Name, setName] = useState(SupportedChainName[56]);
  const [Logo, setLogo] = useState(SupportedChainLogo[56]);

  const reloadBalance = localStorage.getItem("reload");

  const trxState = useSelector<RootState>(
    (state) => state.application.modal?.trxState
  );

  const refresh = useSelector<RootState>(
    (state) => state.application.refresh
  );
  const stateChanged: boolean = trxState === 2;

  useEffect(() => {
    const getBalance = async () => {
      if (account && chainId) {
        try {
          console.log("refresh")
          const balance = await library?.getBalance(account as string);
          setBalance(
            parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4)
          );
          setSymbol(SupportedChainSymbols[chainId as number]);
          setName(SupportedChainName[chainId as number]);
          setLogo(SupportedChainLogo[chainId as number]);
        } catch (err) {
          console.log(err);
          if (!reloadBalance) {
            window.location.reload();
            localStorage.setItem("reload", "true");
          }
        }
      }
    };
    getBalance();
  }, [account, library, chainId, stateChanged,refresh]);

  return [Balance, Symbol, Name, Logo];
};

export const useRGPBalance = () => {
  const { chainId, account, library } = useActiveWeb3React();
  const [RGPBalance, setRGPBalance] = useState("");

  const trxState = useSelector<RootState>(
    (state) => state.application.modal?.trxState
  );
  const refresh = useSelector<RootState>(
    (state) => state.application.refresh
  );
  const stateChanged: boolean = trxState === 2;

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        try {
          const token = await getERC20Token(
            RGPADDRESSES[chainId as number],
            library
          );
          const balance = await token.balanceOf(account);
          setRGPBalance(
            parseFloat(ethers.utils.formatEther(balance)).toFixed(4)
          );
        } catch (err) {
          setRGPBalance("");
          console.log(err,"iruruuru");
        }
      }
    };

    getBalance();
  }, [account, chainId, stateChanged,refresh]);

  return [RGPBalance];
};

export const useTokenBalance = (address: string) => {
  const [balance, setBalance] = useState("");
  const { library } = useActiveWeb3React();

  useEffect(() => {
    const getTokenAmount = async (tokenAddress: string) => {
      try {
        const balance = await library?.getBalance(tokenAddress as string);

        setBalance(
          parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4)
        );
      } catch (err) {
        console.log(err);
        return 0;
      }
    };
    getTokenAmount(address);
  }, [address]);

  return [balance];
};

export const getTokenAmount = async (
  tokenAddress: string,
  library: Web3Provider | undefined
) => {
  try {
    const balance = await library?.getBalance(tokenAddress as string);
    return parseFloat(ethers.utils.formatEther(balance as any)).toFixed(4);
  } catch (err) {
    console.log(err);
    return 0;
  }
};
