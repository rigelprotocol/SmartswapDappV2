import { useMemo } from 'react'
import { uriToHttp } from '../functions/uriToHttp'
export default function useHttpLocations(uri: string | undefined): string[] {
//   const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
//   const resolvedContentHash = useENSContentHash(ens?.ensName)
const ens = false
  return useMemo(() => {
    if (ens) {
    //   return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : []
    return []
    } else {
      return uri ? uriToHttp(uri) : []
    }
//   }, [ens, resolvedContentHash.contenthash, uri])
  }, [ens, uri])
}