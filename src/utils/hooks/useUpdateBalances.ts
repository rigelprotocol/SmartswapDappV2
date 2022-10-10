import { ethers } from "ethers";
import { isAddress } from "@ethersproject/address";
import { getERC20Token } from "../utilsFunctions";
import { Currency, Token } from "@uniswap/sdk-core";
import { Web3Provider } from "@ethersproject/providers";
import JSBI from "jsbi";
import { ParseFloat } from "..";
import { useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useAllTokens } from "../../hooks/Tokens";
import { ExtendedEther, useToken } from "../../hooks/Tokens";
import { useNativeBalance } from "./useBalances";
import { useWeb3React } from "@web3-react/core";
import { filterTokens } from "../../components/Tokens/filtering";
import { useSelector } from "react-redux";

export const getBalance = async (
  currency: Currency,
  Balance: string,
  library: Web3Provider,
  chainId: number,
  account: string
) => {
  try {
    if (currency?.isNative) {
      const balance = Balance === "0.0000" ? "0" : Balance;
      return balance;
    } else if (isAddress(currency?.address)) {
      const token = await getERC20Token(
        currency.address ? currency.address : "",
        library
      );

      const value = await token.balanceOf(account);

      const amount = value ? JSBI.BigInt(value.toString()) : undefined;
      if (amount && chainId) {
        const amountValue = parseFloat(
          ethers.utils.formatUnits(amount.toString(), currency.decimals)
        );

        const balance = amountValue === 0 ? "0" : ParseFloat(amountValue, 4);
        return balance;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const useUpdateBalance = (searchQuery: string) => {
  const { chainId, library, account } = useWeb3React();
  const allTokens = useAllTokens();
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchToken = useToken(debouncedQuery);
  const [Balance, Symbol, Name, Logo] = useNativeBalance();
  const ether = chainId && ExtendedEther(chainId, Symbol, Name, Logo);

  const filteredTokens: Token[] = filterTokens(
    Object.values(allTokens),
    debouncedQuery
  );

  const sortTokens = (List: any[]) => {
    const ListArray = [...List];
    const filteredList = ListArray.filter((item) => item[2] !== "RGP");
    const RGP = ListArray.filter((item) => item[2] === "RGP");
    const result = filteredList.sort(function (a, b) {
      return b[1] - a[1];
    });

    const newResultArray = result.length > 0 ? [...result] : [];
    result.length > 0 && account && newResultArray.unshift(RGP[0]);

    return newResultArray;
  };

  const { TokenList } = useTokenBalance(filteredTokens, "");

  const sortedTokenList = sortTokens(TokenList);

  return { sortedTokenList };
};

export const useTokenBalance = (
  filteredTokens: Token[],
  searchQuery: string
) => {
  const { library, account } = useWeb3React();
  const ChainId: number = useSelector((state) => state.chainId.chainId);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchToken = useToken(debouncedQuery);
  const [Balance, Symbol, Name, Logo] = useNativeBalance();
  const ether = ChainId && ExtendedEther(ChainId, Symbol, Name, Logo);
  const [TokenList, setTokenList] = useState([]);
  const [Native, setNative] = useState<
    | 0
    | {
        chainId: number;
        decimals: number;
        isNative: boolean;
        isToken: boolean;
        name: string;
        symbol: string;
        logoURI: string;
      }
    | undefined
  >();

  const loopCurrencies = async (tokens: Currency[]) => {
    const balances = [];
    for (let i = 0; i < tokens.length; i++) {
      const balance = await getBalance(
        tokens[i],
        Balance,
        library,
        ChainId,
        account
      );

      balances.push([
        tokens[i],
        balance && parseFloat(parseFloat(balance).toFixed(4)),
        tokens[i].symbol,
      ]);
    }
    return balances;
  };

  const getNativeBalance = async () => {
    const newBalance = await library?.getBalance(account);

    const formatBalance = parseFloat(
      parseFloat(ethers.utils.formatEther(newBalance.toString())).toFixed(4)
    );

    return [ether, formatBalance, Symbol];
  };

  const filteredTokenListWithETH = async (filteredTokens: Token[]) => {
    const s = debouncedQuery.toLowerCase().trim();
    const newArray = await loopCurrencies(filteredTokens);
    const native = await getNativeBalance();

    if (s === "" || s === "e" || s === "et" || s === "eth") {
      return ether && newArray
        ? [native, ...newArray]
        : ether && filteredTokens
        ? [ether, ...filteredTokens]
        : filteredTokens;
    } else {
      return filteredTokens;
    }
  };

  useMemo(() => {
    const getBalances = async () => {
      if (account) {
        const tokens = await filteredTokenListWithETH(filteredTokens);
        setTokenList(tokens);
      }
    };

    getBalances();
  }, [ChainId, Symbol, Name]);

  return { TokenList };
};
