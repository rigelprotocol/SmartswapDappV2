import gtag from "ga-gtag"

// add liquidity
// remove liquidty
// find pool
// failed transaction
// sussfully transaction


export const GAddLiquidity = (
    fromToken:string="null",
    toToken:string="null"
    ) => {
      gtag('event', 'add_liquidity', {
        page:"liquidity page",
        poll_title: 'smartswap swap',
        fromToken,
        toToken
      })
    }
  
export const GRemoveLiquidity = (
    fromToken:string="null",
    toToken:string="null"
    ) => {
      gtag('event', 'remove_liquidity', {
        page:"liquidity page",
        poll_title: 'smartswap swap',
        fromToken,
        toToken
      })
    }
  
  
export const GFindLiquidity = (
    fromToken:string="null",
    toToken:string="null"
    ) => {
      gtag('event', 'find_liquidity', {
        page:"liquidity page",
        poll_title: 'smartswap swap',
        fromToken,
        toToken
      })
    }
  
  