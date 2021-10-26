// import ethereumLogoUrl from 'assets/images/ethereum-logo.png'

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 6,
  POLYGON = 137,
  BINANCE = 56,
  BINANCETEST = 97,
  POLYGONTEST = 80001
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.BINANCE,
  SupportedChainId.POLYGON,

  
  SupportedChainId.POLYGONTEST,
  SupportedChainId.BINANCETEST,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,

]

export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.BINANCE,
  SupportedChainId.POLYGON,
  SupportedChainId.BINANCETEST,
  SupportedChainId.POLYGONTEST,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]




export interface L1ChainInfo {
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly explorer: string
  readonly infoLink: string
  readonly label: string
  readonly logoUrl?: string
  readonly rpcUrls?: string[]
  readonly nativeCurrency: {
    name: string // 'Goerli ETH',
    symbol: string // 'gorETH',
    decimals: number //18,
  }
}
export interface L2ChainInfo extends L1ChainInfo {
  readonly bridge: string
  readonly logoUrl: string
  readonly statusPage?: string
}

export type ChainInfo = { readonly [chainId: number]: L1ChainInfo  }  &
  { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.ROPSTEN]: {
    docs: '',
    explorer: 'https://ropsten.etherscan.io/',
    infoLink: '',
    label: 'Ropsten',
    nativeCurrency: { name: 'Ropsten ETH', symbol: 'ropETH', decimals: 18 },
  },
  [SupportedChainId.BINANCE]: {
    docs: '',
    explorer: 'https://binance.org/',
    infoLink: '',
    label: 'Binance',
    nativeCurrency: { name: 'Binance BNB', symbol: 'BNB', decimals: 18 },
  },
  [SupportedChainId.BINANCETEST]: {
    docs: '',
    explorer: 'https://testnet.binance.org/faucet-smart',
    infoLink: '',
    label: 'Binance',
    nativeCurrency: { name: 'Binance tBNB', symbol: 'tBNB', decimals: 18 },
  },
  [SupportedChainId.POLYGON]: {
    docs: '',
    explorer: 'https://polygon.technology/',
    infoLink: '',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon POL', symbol: 'POL', decimals: 18 },
  },
  [SupportedChainId.POLYGONTEST]: {
    docs: '',
    explorer: 'https://polygon.technology/',
    infoLink: '',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon POL', symbol: 'POL', decimals: 18 },
  },

  [SupportedChainId.MAINNET]: {
    docs: '',
    explorer: 'https://etherscan.io/',
    infoLink: '',
    label: 'Ethereum',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.RINKEBY]: {
    docs: '',
    explorer: 'https://rinkeby.etherscan.io/',
    infoLink: '',
    label: 'Rinkeby',
    nativeCurrency: { name: 'Rinkeby ETH', symbol: 'rinkETH', decimals: 18 },
  },
  [SupportedChainId.ROPSTEN]: {
    docs: '',
    explorer: 'https://ropsten.etherscan.io/',
    infoLink: '',
    label: 'Ropsten',
    nativeCurrency: { name: 'Ropsten ETH', symbol: 'ropETH', decimals: 18 },
  },
  [SupportedChainId.KOVAN]: {
    docs: '',
    explorer: 'https://kovan.etherscan.io/',
    infoLink: '',
    label: 'Kovan',
    nativeCurrency: { name: 'Kovan ETH', symbol: 'kovETH', decimals: 18 },
  },
  [SupportedChainId.GOERLI]: {
    docs: '',
    explorer: 'https://goerli.etherscan.io/',
    infoLink: '',
    label: 'Görli',
    nativeCurrency: { name: 'Görli ETH', symbol: 'görETH', decimals: 18 },
  },
}

