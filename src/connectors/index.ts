import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { BscConnector } from "@binance-chain/bsc-connector";
import { NetworkConnector } from "./NetworkConnector";
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from "../constants/chains";

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL;

export const RPC = {
  [SupportedChainId.BINANCE]: `https://bsc-dataseed4.binance.org`,
  [SupportedChainId.BINANCETEST]:
    "https://data-seed-prebsc-2-s3.binance.org:8545",
  [SupportedChainId.ROPSTEN]:
    "https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW",
  [SupportedChainId.RINKEBY]:
    "https://eth-rinkeby.alchemyapi.io/v2/XVLwDlhGP6ApBXFz_lfv0aZ6VmurWhYD",
  [SupportedChainId.GOERLI]:
    "https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im",
  [SupportedChainId.KOVAN]:
    "https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER",
  [SupportedChainId.POLYGON]: `https://rpc-mainnet.maticvigil.com`,
  [SupportedChainId.POLYGONTEST]: "https://rpc-mumbai.matic.today",
  [SupportedChainId.OASISTEST]: "https://testnet.emerald.oasis.dev",
  [SupportedChainId.OASISMAINNET]: "https://emerald.oasis.dev",
  [SupportedChainId.AVALANCHE]: "https://api.avax.network/ext/bc/C/rpc",
  [SupportedChainId.AVALANCHE_FUJI]: "https://api.avax-test.network/ext/bc/C/rpc",
};

export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  BSC = "bsc",
}

export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? "56"
);

if (typeof NETWORK_URL === "undefined") {
  throw new Error(
    `REACT_APP_NETWORK_URL must be a defined environment variable`
  );
}

export const network = new NetworkConnector({
  urls: RPC,
  defaultChainId: 56,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});
const supportedChainIds = [3, 4, 56, 97, 80001, 137, 42261, 42262, 43114, 43113];
export const checkSupportedIds = (chainID: number) =>
  supportedChainIds.some((id) => id === chainID);
export const bscConnector = new BscConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: RPC,
  qrcode: true,
  // bridge: 'https://bridge.walletconnect.org',
  // pollingInterval: 15000,
});

// export const walletlink = new WalletLinkConnector({
//     url: NETWORK_URL,
//     appName: 'Smartswap',
//     appLogoUrl: SMARTSWAP_LOGO

// })

export const connectorKey = "connectv2";

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
};
