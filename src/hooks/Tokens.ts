import { useCombinedActiveList } from "../state/lists/hooks"
import { Currency, Token } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '../state/lists/WrappedTokenInfo'
import { useWeb3React } from "@web3-react/core"
import {TokenAddressMap} from "../state/lists/hooks"
import {useState, useEffect } from "react"
import { checkSupportedIds } from "../connectors"
// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const [chainid,setchainid] = useState(56)
    const { chainId } = useWeb3React()
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
