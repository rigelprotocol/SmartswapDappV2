import { useCombinedActiveList } from "../state/lists/hooks"
import { Currency, Token,NativeCurrency,Ether } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '../state/lists/WrappedTokenInfo'
import { useActiveWeb3React } from '../utils/hooks/useActiveWeb3React'
import {TokenAddressMap} from "../state/lists/hooks"
import {useState, useEffect } from "react"
import { checkSupportedIds } from "../connectors"
import { isAddress } from "../utils/utilsFunctions"
import { useNativeBalance } from "../utils/hooks/useBalances"
// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const [chainid,setchainid] = useState(56)
    const { chainId } = useActiveWeb3React()
    // const userAddedTokens = useUserAddedTokens()
    // 
    useEffect(()=>{
      if(!chainId || !checkSupportedIds(chainId)){
        setchainid(56)
      }else{
        setchainid(chainId)
      }

    },[chainId])
    return useMemo(() => {
  //     if (!chainId) {
  //       return {}
  // }
      // reduce to just tokens
      const mapWithoutUrls = Object.keys(tokenMap[chainid]).reduce<{ [address: string]: Token }>((newMap, address) => {
        newMap[address] = tokenMap[chainid][address].token
        return newMap
      }, {})
    //   if (includeUserAdded) {
    //     return (
    //       userAddedTokens
    //         // reduce into all ALL_TOKENS filtered by the current chain
    //         .reduce<{ [address: string]: Token }>(
    //           (tokenMap, token) => {
    //             tokenMap[token.address] = token
    //             return tokenMap
    //           },
    //           // must make a copy because reduce modifies the map, and we do not
    //           // want to make a copy in every iteration
    //           { ...mapWithoutUrls }
    //         )
    //     )
    //   }
  
      return mapWithoutUrls
    }, [chainId, tokenMap, includeUserAdded])
  }

    export function useAllTokens(): { [address: string]: Token } {
        const allTokens = useCombinedActiveList()
        return useTokensFromMap(allTokens, true)
      }

  export const ExtendedEther = (chainId:number  = 56,symbol:string,name:string,logo:string) =>{
    let native = {
      chainId: chainId,
      decimals: 18,
      isNative: true,
      isToken: false,
      name,
      symbol,
    logoURI:logo}
      return native
  
}

export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)
  const token: Token | undefined = address ? tokens[address] : undefined

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    return undefined
  }, [
    address,
    chainId,
    token,
  ])

}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const [,Symbol,Name,Logo] = useNativeBalance();
  const { chainId } = useActiveWeb3React()
  const isNative = currencyId?.toUpperCase() === Symbol
  const token = useToken(isNative ? undefined : currencyId)
  return isNative ? chainId && ExtendedEther(chainId,Symbol,Name,Logo) : token
  
}
