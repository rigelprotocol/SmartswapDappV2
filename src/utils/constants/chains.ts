import BNBLOGO from '../../assets/BNB.svg';
import ETHLOGO from '../../assets/eth.svg';
import MATICLOGO from '../../assets/Matic.svg';
export const SupportedChainSymbols: { [key: string]: string } = {
  '1': 'ETH',
  '3': 'ETH',
  '4': 'ETH',
  '56': 'BNB',
  '97': 'BNB',
  '137': 'MATIC',
  '80001': 'MATIC',
};

export const SupportedChainName: { [key: string]: string } = {
  '1': 'Ether',
  '3': 'Ether',
  '4': 'Ether',
  '56': 'Binance Coin',
  '97': 'Binance Coin',
  '137': 'Matic',
  '80001': 'Matic',
};

export const SupportedChainLogo: { [key: string]: string } = {
  '1': ETHLOGO,
  '3': ETHLOGO,
  '4': ETHLOGO,
  '56': BNBLOGO,
  '97': BNBLOGO,
  '137': MATICLOGO,
  '80001': MATICLOGO,
};

export const WrappedSymbols: { [key: string]: string } = {
  '1': 'WETH',
  '3': 'WETH',
  '4': 'WETH',
  '56': 'WBNB',
  '97': 'WBNB',
  '80001': 'WMATIC',
  '137': 'WMATIC',
};
