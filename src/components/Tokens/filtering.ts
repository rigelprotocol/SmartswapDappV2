import { isAddress } from "../../utils";
import { Token } from "@uniswap/sdk-core";
import { TokenInfo } from "@uniswap/token-lists";
import  {useMemo} from 'react';
/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
 const alwaysTrue = () => true

export function createTokenFilterFunction<T extends Token | TokenInfo>(search: string): (tokens: T) => boolean {
    const searchingAddress = isAddress(search)

    if (searchingAddress) {
        const lower = searchingAddress.toLowerCase()
        return (t: T) => ('isToken' in t ? searchingAddress === t.address : lower === t.address.toLowerCase())
      }

      const lowerSearchParts = search
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
      if (lowerSearchParts.length === 0) return alwaysTrue

      const matchesSearch = (s: string): boolean => {
        const sParts = s
          .toLowerCase()
          .split(/\s+/)
          .filter((s) => s.length > 0)
    
        return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
      }
    
      return ({ name, symbol }: T): boolean => Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
    
}

export function filterTokens<T extends Token | TokenInfo>(tokens: T[], search: string): T[] {
    return tokens.filter(createTokenFilterFunction(search))
  }

export function createFilterToken<T extends TokenInfo | Token>(search: string): (token: T) => boolean {
    const searchingAddress = isAddress(search)

    if (searchingAddress) {
        const address = searchingAddress.toLowerCase()
        return (t: T) => 'address' in t && address === t.address.toLowerCase()
    }

    const lowerSearchParts = search
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0)

    if (lowerSearchParts.length === 0) {
        return () => true
    }

    const matchesSearch = (s: string): boolean => {
        const sParts = s
            .toLowerCase()
            .split(/\s+/)
            .filter((s_) => s_.length > 0)

        return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
    }
    return (token) => {
        const { symbol, name } = token
        return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
    }
}