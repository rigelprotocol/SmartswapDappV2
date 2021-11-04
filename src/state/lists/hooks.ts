import DEFAULT_TOKEN_LIST from "@rigelprotocol_01/default-token-list"
import { TokenList } from '@uniswap/token-lists'
import {WrappedTokenInfo} from "./WrappedTokenInfo"
import { TagInfo } from "./WrappedTokenInfo"
export type TokenAddressMap = Readonly<{
    [chainId: number]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
  }>

  const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

  export function listToTokenMap(list: TokenList): TokenAddressMap {
    const result = listCache?.get(list)
    if (result) return result
  
    const map = list.tokens.reduce<TokenAddressMap>((tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
      tokenInfo.tags
        ?.map((tagId) => {
          if (!list.tags?.[tagId]) return undefined
          return { ...list.tags[tagId], id: tagId }
        })
        ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId]?.[token.address] !== undefined) {
        console.error(new Error(`Duplicate token! ${token.address}`))
        return tokenMap
      }
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list,
          },
        },
      }
    }, {})
    listCache?.set(list, map)
    return map
  }
function combineMaps( map2: TokenAddressMap): TokenAddressMap {
  return {
    1: {  ...map2[1] }, // mainnet
    3: {  ...map2[3] }, // ropsten
    4: {  ...map2[4] }, // rinkeby
    56: { ...map2[56] }, // bsc mainnet
    97: {  ...map2[97] }, // bsc testnet
    137: {  ...map2[137] }, // matic
    80001: {  ...map2[80001] }, // matic testnet
  }
}

const TRANSFORMED_DEFAULT_TOKEN_LIST = listToTokenMap(DEFAULT_TOKEN_LIST)
export const useCombinedActiveList= () => {
  const activeListUrls = [] // empty array for now..fill it up with active url
  const activeTokens: string[] | undefined = [] //convert empty array list into token map useCombinedTokenMapFromUrls(activeListUrls)
  return combineMaps(TRANSFORMED_DEFAULT_TOKEN_LIST)
}