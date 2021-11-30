import { useAllLists } from './hooks'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAllInactiveTokens } from '../../hooks/Tokens'
import { UNSUPPORTED_LIST_URLS } from '../../utils/constants/lists'
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React'
import useFetchListCallback from '../../utils/hooks/useFetchListCallback'
import useInterval from '../../utils/hooks/useInterval'
// import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { AppDispatch } from '../index'
import { acceptListUpdate } from './actions'
import { useActiveListUrls } from './hooks'

export default function Updater(): null {
  const { library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
//   const isWindowVisible = useIsWindowVisible()

  // get all loaded lists, and the active urls
  const lists = useAllLists()
  const activeListUrls = useActiveListUrls()

  // initiate loading
  useAllInactiveTokens()

  const fetchList = useFetchListCallback()
  const fetchAllListsCallback = useCallback(() => {
    // if (!isWindowVisible) return
    Object.keys(lists).forEach((url) =>
      fetchList(url).catch((error) => console.debug('interval list fetching error', error)),
    )
  }, [fetchList, lists])

  // fetch all lists every 10 minutes, but only after we initialize library
 useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      // const list = lists[listUrl]
      // if (!list.current && !list.loadingRequestId && !list.error) {
      //   fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      // }
    })
  }, [dispatch, fetchList, library, lists])

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    Object.keys(UNSUPPORTED_LIST_URLS).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [dispatch, fetchList, library, lists])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        // eslint-disable-next-line default-case
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          // update any active or inactive lists
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl))
        }
      }
    })
  }, [dispatch, lists, activeListUrls])

  return null
}
