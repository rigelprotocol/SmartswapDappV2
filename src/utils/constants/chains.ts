import BNBLOGO from '../../assets/BNB.svg';
import ETHLOGO from '../../assets/eth.svg';
import NULL24LOGO from '../../assets/Null-24.svg';
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
  '137': NULL24LOGO,
  '80001': NULL24LOGO,
};
