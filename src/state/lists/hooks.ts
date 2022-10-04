import {useMemo,useCallback, useEffect} from "react"
import DEFAULT_TOKEN_LIST from "../../utils/constants/tokenList/rigelprotocol-default.tokenList.json"
import { TokenList } from '@uniswap/token-lists'
import {WrappedTokenInfo} from "./WrappedTokenInfo"
// import { TagInfo } from "./WrappedTokenInfo"
import { Tags } from "@uniswap/token-lists"
import { DEFAULT_LIST_OF_LISTS } from "../../utils/constants/lists"
import { AppDispatch, RootState } from ".."
import { UNSUPPORTED_LIST_URLS } from "../../utils/constants/lists"
import UNSUPPORTED_TOKEN_LIST from '../../utils/constants/tokenList/rigelprotocol-unsupported.tokenlist.json'
import { useAllInactiveTokens } from "../../hooks/Tokens"

import { useDispatch, useSelector } from 'react-redux'
type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

export type TokenAddressMap = Readonly<{
    [chainId: number]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
  }>

  const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

  export function useAllLists(): RootState['lists']['byUrl'] {
    return useSelector((state:RootState) => state.lists.byUrl)
  }
  
// use ordering of default list of lists to assign priority
function sortByListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1
  if (first > second) return -1
  return 0
}

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

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()
  return useMemo(() => {
    if (!urls) return {}
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            return combineMaps(allTokens, listToTokenMap(current))
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, {})
    )
  }, [lists, urls])
}
// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  let data= useSelector<RootState, RootState['lists']['activeListUrls']>((state) => state.lists.activeListUrls)
  return data?.filter(
    (url) => !UNSUPPORTED_LIST_URLS.includes(url),
  )
}
export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url))
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls()
  return useCombinedTokenMapFromUrls(allInactiveListUrls)
}


function combineMaps(map1: TokenAddressMap,  map2: TokenAddressMap): TokenAddressMap {
  return {
    1: { ...map1[1], ...map2[1] }, // mainnet
    3: {  ...map1[3],...map2[3] }, // ropsten
    4: { ...map1[4], ...map2[4] }, // rinkeby
    56: {...map1[56],...map2[56] }, // bsc mainnet
    97: {...map1[97], ...map2[97] }, // bsc testnet
    137: {...map1[137], ...map2[137] }, // matic
    80001: {...map1[80001], ...map2[80001] }, // matic testnet
    42261: {...map1[42261], ...map2[42261] }, // oasis testnet
    42262: {...map1[42262], ...map2[42262] }, // oasis mainnet
    43114: {...map1[43114], ...map2[43114] }, // avalanche
    43113: {...map1[43113], ...map2[43113] }, // fuji
  }
}

export const useCombinedActiveList= () => {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST)
  return combineMaps(activeTokens,defaultTokenMap)
 
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}