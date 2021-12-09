import { serializeToken, Token } from '../helpers/token'
import { SerializedToken } from './types'


const MAINNET = 1;
const TESTNET = 57;
// const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export const mainnetTokens = {
  wbnb: new Token(
    MAINNET,
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
    // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(MAINNET, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', 18, 'BNB', 'BNB', 'https://www.binance.com/'),
  rgp: new Token(
    MAINNET,
    '0xfa262f303aa244f9cc66f312f0755d89c3793192',
    18,
    'RGP',
    'RigelToken (RGP)',
    'http://www.rigelprotocol.com/',
  ),
  
  busd: new Token(
    MAINNET,
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  axs: new Token(
    MAINNET,
    '0x715d400f88c167884bbcc41c5fea407ed4d2f8a0',
    18,
    'AXS',
    'Binance-Pegged Axie Infinity Shard',
    'https://axieinfinity.com/',
  ),
  }

export const testnetTokens = {
  wbnb: new Token(
    TESTNET,
    '0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  busd: new Token(
    TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
}

const tokens = (): TokenList => {
  

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()