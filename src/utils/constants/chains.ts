import BNBLOGO from "../../assets/BNB.svg";
import ETHLOGO from "../../assets/eth.svg";
import MATICLOGO from "../../assets/Matic.svg";
import OASISLOGO from "../../assets/oasis.png";
import AVAXLOGO from "../../assets/AVAX.svg";
export const SupportedChainSymbols: { [key: string]: string } = {
  "1": "ETH",
  "3": "ETH",
  "4": "ETH",
  "56": "BNB",
  "97": "BNB",
  "137": "MATIC",
  "80001": "MATIC",
  "42261": "ROSE",
  "42262": "ROSE",
  "43114": "AVAX",
  "43113": "AVAX",
};

export const SupportedChainName: { [key: string]: string } = {
  "1": "Ether",
  "3": "Ether",
  "4": "Ether",
  "56": "Binance Coin",
  "97": "Binance Coin",
  "137": "Matic",
  "80001": "Matic",
  "42261": "ROSE",
  "42262": "ROSE",
  "43114": "AVAX",
  "43113": "AVAX",
};

export const SupportedChainLogo: { [key: string]: string } = {
  "1": ETHLOGO,
  "3": ETHLOGO,
  "4": ETHLOGO,
  "56": BNBLOGO,
  "97": BNBLOGO,
  "137": MATICLOGO,
  "80001": MATICLOGO,
  "42261": OASISLOGO,
  "42262": OASISLOGO,
  "43114": AVAXLOGO,
  "43113": AVAXLOGO,
};

export const WrappedSymbols: { [key: string]: string } = {
  "1": "WETH",
  "3": "WETH",
  "4": "WETH",
  "56": "WBNB",
  "97": "WBNB",
  "80001": "WMATIC",
  "137": "WMATIC",
  "42261": "WROSE",
  "42262": "WROSE",
  "43114": "WAVAX",
  "43113": "WAVAX",
};
