import { SupportedChainId } from '../constants/chains'

const ETHERSCAN_PREFIXES: { [chainId: number]: string } = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.ROPSTEN]: 'ropsten.',
  [SupportedChainId.RINKEBY]: 'rinkeby.',
  [SupportedChainId.GOERLI]: 'goerli.',
  [SupportedChainId.KOVAN]: 'kovan.',
  [SupportedChainId.POLYGON]: 'polygon.',
  [SupportedChainId.BINANCE]: 'binance.',
  [SupportedChainId.BINANCETEST]: 'binance-test.',
  [SupportedChainId.POLYGONTEST]: 'polygon-test.',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  if (chainId === SupportedChainId.POLYGONTEST || chainId === SupportedChainId.POLYGON) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://polygon.technology/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://polygon.technology/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://polygon.technology/block/${data}`
      default:
        return `https://polygon.technology/`
    }
  }

  if (chainId === SupportedChainId.BINANCE) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://binance.org/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://binance.org/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://binance.org/block/${data}`
      default:
        return `https://binance.org/`
    }
  }

  if (chainId === SupportedChainId.BINANCETEST) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://testnet.binance.org/faucet-smart/tx/${data}`
      case ExplorerDataType.ADDRESS:
      case ExplorerDataType.TOKEN:
        return `https://testnet.binance.org/faucet-smart/address/${data}`
      case ExplorerDataType.BLOCK:
        return `https://testnet.binance.org/faucet-smart/block/${data}`
      default:
        return `https://testnet.binance.org/faucet-smart`
    }
  }

  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] ?? ''}etherscan.io`

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`

    case ExplorerDataType.BLOCK:
      if (chainId === SupportedChainId.GOERLI || chainId === SupportedChainId.ROPSTEN || chainId === SupportedChainId.KOVAN || chainId === SupportedChainId.RINKEBY) {
        return `${prefix}/tx/${data}`
      }
      return `${prefix}/block/${data}`

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`
    default:
      return `${prefix}`
  }
}
