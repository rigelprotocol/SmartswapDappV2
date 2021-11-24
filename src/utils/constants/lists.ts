const YEARN_LIST = 'https://yearn.science/static/tokenlist.json'
const NFTX_LIST = 'https://nftx.ethereumdb.com/v2/tokenlist/'
const AAVE_LIST = 'tokenlist.aave.eth'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  COMPOUND_LIST,
  AAVE_LIST,
 
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [NFTX_LIST, YEARN_LIST, GEMINI_LIST]
