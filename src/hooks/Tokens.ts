import { useCombinedActiveList } from "../state/lists/hooks";
import { Currency, Token } from "@uniswap/sdk-core";
import { useUserAddedTokens } from "../state/user/hooks";
import { useActiveWeb3React } from "../utils/hooks/useActiveWeb3React";
import { useState, useEffect, useMemo } from "react";
import { isAddress } from "../utils";
import { getERC20Token } from "../utils/utilsFunctions";
import { useNativeBalance } from "../utils/hooks/useBalances";
import { useCombinedInactiveList, TokenAddressMap } from "../state/lists/hooks";
import { useSelector } from "react-redux";

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean
): { [address: string]: Token } {
  const { chainId, account } = useActiveWeb3React();
  const ChainId: number = useSelector((state) => state.chainId.chainId);
  const userAddedTokens = useUserAddedTokens();

  return useMemo(() => {
    if (!ChainId) {
      return {};
    }

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[ChainId] ?? {}).reduce<{
      [address: string]: Token;
    }>((newMap, address) => {
      newMap[address] = tokenMap[ChainId][address].token;
      return newMap;
    }, {});
    if (includeUserAdded && account) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token;
              return tokenMap;
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      );
    }

    return mapWithoutUrls;
  }, [ChainId, tokenMap, includeUserAdded]);
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList();
  return useTokensFromMap(allTokens, true);
}

export const ExtendedEther = (
  chainId: number = 56,
  symbol: string,
  name: string,
  logo: string
) => {
  let native = {
    chainId: chainId,
    decimals: 18,
    isNative: true,
    isToken: false,
    name,
    symbol,
    logoURI: logo,
  };
  return native;
};

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens();

  if (!activeTokens || !token) {
    return false;
  }

  return !!activeTokens[token.address];
}

export function useAllInactiveTokens(): { [address: string]: Token } {
  // get inactive tokens
  const inactiveTokensMap = useCombinedInactiveList();
  const inactiveTokens = useTokensFromMap(inactiveTokensMap, false);

  // filter out any token that are on active list
  const activeTokensAddresses = Object.keys(useAllTokens());
  const filteredInactive = activeTokensAddresses
    ? Object.keys(inactiveTokens).reduce<{ [address: string]: Token }>(
        (newMap, address) => {
          if (!activeTokensAddresses.includes(address)) {
            newMap[address] = inactiveTokens[address];
          }
          return newMap;
        },
        {}
      )
    : inactiveTokens;

  return filteredInactive;
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(
  currency: Currency | undefined | null
): boolean | undefined {
  const userAddedTokens = useUserAddedTokens();

  if (!currency) {
    return false;
  }

  return !!userAddedTokens.find((token) => {
    if (token && currency && !currency.isNative) {
      return currency.address === token.address &&
        currency.chainId === token.chainId
        ? true
        : false;
    }
  });
}

export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId, library } = useActiveWeb3React();
  const tokens = useAllTokens();
  const [token, setToken] = useState<undefined | Token>();
  useEffect(() => {
    const getToken = async (
      tokenAddress: string | undefined,
      chainId: number
    ) => {
      const address = isAddress(tokenAddress);
      const token: Token | undefined = address ? tokens[address] : undefined;
      try {
        if (token) setToken(token);
        if (!chainId || !address) setToken(undefined);
        if (address && !tokens[address]) {
          const tokenContract = await getERC20Token(address, library);
          const name = await tokenContract.name();
          const tokenDecimal = await tokenContract.decimals();
          const tokenSymbol = await tokenContract.symbol();

          let newToken = new Token(
            chainId,
            address,
            tokenDecimal,
            tokenSymbol,
            name
          );
          setToken(newToken);
        }
      } catch (e) {
        console.log("no Token found");
      }

      // setToken(undefined)
    };

    getToken(tokenAddress, chainId ?? 56);
  }, [tokenAddress, chainId]);

  return token;
  // 0x03fF0ff224f904be3118461335064bB48Df47938
}

export function useCurrency(
  currencyId: string | undefined
): Currency | null | undefined {
  const [, Symbol, Name, Logo] = useNativeBalance();
  const { chainId } = useActiveWeb3React();
  const isNative = currencyId?.toUpperCase() === Symbol;
  const token = useToken(isNative ? undefined : currencyId);
  return isNative
    ? chainId && ExtendedEther(chainId, Symbol, Name, Logo)
    : token;
}
