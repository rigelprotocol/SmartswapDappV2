// import ethereumLogoUrl from 'assets/images/ethereum-logo.png'

export enum SupportedChainId {
  //MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 6,
  POLYGON = 137,
  BINANCE = 56,
  BINANCETEST = 97,
  POLYGONTEST = 80001,
  OASISTEST = 42261,
  OASISMAINNET = 42262,
  AVALANCHE = 43114,
  AVALANCHE_FUJI = 43113,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  //SupportedChainId.MAINNET,
  SupportedChainId.BINANCE,
  SupportedChainId.POLYGON,

  SupportedChainId.POLYGONTEST,
  SupportedChainId.BINANCETEST,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.OASISTEST,
  SupportedChainId.OASISMAINNET,
  SupportedChainId.AVALANCHE,
  SupportedChainId.AVALANCHE_FUJI,
];

export const L1_CHAIN_IDS = [
  // SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.BINANCE,
  SupportedChainId.POLYGON,
  SupportedChainId.BINANCETEST,
  SupportedChainId.POLYGONTEST,
  SupportedChainId.OASISTEST,
  SupportedChainId.OASISMAINNET,
  SupportedChainId.AVALANCHE,
  SupportedChainId.AVALANCHE_FUJI,
] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];

export interface L1ChainInfo {
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly label: string;
  readonly logoUrl?: string;
  readonly rpcUrls?: string[];
  readonly nativeCurrency: {
    name: string; // 'Goerli ETH',
    symbol: string; // 'gorETH',
    decimals: number; //18,
  };
}
export interface L2ChainInfo extends L1ChainInfo {
  readonly bridge: string;
  readonly logoUrl: string;
  readonly statusPage?: string;
}

export type ChainInfo = { readonly [chainId: number]: L1ChainInfo } & {
  readonly [chainId in SupportedL1ChainId]: L1ChainInfo;
};

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.ROPSTEN]: {
    docs: "",
    explorer: "https://ropsten.etherscan.io/",
    infoLink: "",
    label: "Ropsten",
    nativeCurrency: { name: "Ethereum", symbol: "ropETH", decimals: 18 },
  },
  [SupportedChainId.BINANCE]: {
    docs: "",
    explorer: "https://www.bscscan.com/",
    infoLink: "",
    label: "Binance",
    nativeCurrency: { name: "Binance", symbol: "BNB", decimals: 18 },
  },
  [SupportedChainId.AVALANCHE]: {
    docs: "",
    explorer: "https://snowtrace.io/",
    infoLink: "",
    label: "Avalanche",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  },
  [SupportedChainId.BINANCETEST]: {
    docs: "",
    explorer: "https://testnet.bscscan.com/",
    infoLink: "",
    label: "BSC Testnet",
    nativeCurrency: { name: "Binance", symbol: "tBNB", decimals: 18 },
  },
  [SupportedChainId.POLYGON]: {
    docs: "",
    explorer: "https://polygonscan.com/",
    infoLink: "",
    label: "Polygon",
    nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
  },
  [SupportedChainId.POLYGONTEST]: {
    docs: "",
    explorer: "https://mumbai.polygonscan.com/",
    infoLink: "",
    label: "Mumbai Testnet",
    nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
  },
  [SupportedChainId.AVALANCHE_FUJI]: {
    docs: "",
    explorer: "https://testnet.snowtrace.io/",
    infoLink: "",
    label: "Avalanche Fuji Testnet",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  },
  /*
  [SupportedChainId.MAINNET]: {
    docs: '',
    explorer: 'https://etherscan.io/',
    infoLink: '',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  },
  */
  [SupportedChainId.RINKEBY]: {
    docs: "",
    explorer: "https://rinkeby.etherscan.io/",
    infoLink: "",
    label: "Rinkeby",
    nativeCurrency: { name: "Ethereum", symbol: "rinkETH", decimals: 18 },
  },
  [SupportedChainId.ROPSTEN]: {
    docs: "",
    explorer: "https://ropsten.etherscan.io/",
    infoLink: "",
    label: "Ropsten",
    nativeCurrency: { name: "Ethereum", symbol: "ropETH", decimals: 18 },
  },
  [SupportedChainId.KOVAN]: {
    docs: "",
    explorer: "https://kovan.etherscan.io/",
    infoLink: "",
    label: "Kovan",
    nativeCurrency: { name: "Ethereum", symbol: "kovETH", decimals: 18 },
  },
  [SupportedChainId.GOERLI]: {
    docs: "",
    explorer: "https://goerli.etherscan.io/",
    infoLink: "",
    label: "Görli",
    nativeCurrency: { name: "Ethereum", symbol: "görETH", decimals: 18 },
  },
  [SupportedChainId.OASISTEST]: {
    docs: "",
    explorer: "https://explorer.emerald.oasis.dev/",
    infoLink: "",
    label: "Oasis Emerald Testnet",
    nativeCurrency: { name: "ROSE", symbol: "ROSE", decimals: 18 },
  },
  [SupportedChainId.OASISMAINNET]: {
    docs: "",
    explorer: "https://testnet.explorer.emerald.oasis.dev/",
    infoLink: "",
    label: "Oasis Emerald Mainnet",
    nativeCurrency: { name: "ROSE", symbol: "ROSE", decimals: 18 },
  },
};
