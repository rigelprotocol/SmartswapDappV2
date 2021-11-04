import React, { FunctionComponent, useMemo } from 'react'
import { SupportedChainSymbols,SupportedChainLogo } from '../../utils/constants/chains'
import { Currency,WETH9 } from '@uniswap/sdk-core'
import { WrappedTokenInfo } from '../../state/lists/WrappedTokenInfo'
import Logo from '../Logo'
import useHttpLocations from '../../utils/hooks/useHttpLocations'


function getCurrencySymbol(currency) {
    if (currency.symbol === 'WBTC') {
      return 'btc'
    }
    if (currency.symbol === 'WETH') {
      return 'eth'
    }
    return currency.symbol.toLowerCase()
  }

  export function getCurrencyLogoUrls(currency) {
    const urls = []
  
    urls.push(`https://raw.githubusercontent.com/sushiswap/icons/master/token/${getCurrencySymbol(currency)}.jpg`)
    console.log({currency})
    if (currency.chainId in SupportedChainSymbols) {
      urls.push(
        `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${SupportedChainSymbols[currency.chainId]}/assets/${
          currency.address
        }/logo.png`
      )
      urls.push(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${SupportedChainSymbols[currency.chainId]}/assets/${
          currency.address
        }/logo.png`
      )
    }
  
    return urls
  }
const LOGO = SupportedChainLogo

  interface CurrencyLogoProps {
    currency?: Currency
    size?: string | number
    style: React.CSSProperties
    className?: string
    squared?: boolean,
  }
  const unknown = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png'


  const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
    currency,
    size = '24px',
    style,
    className = '',
    squared,
    ...rest
  }) => {
    const uriLocations = useHttpLocations(
      currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
    )
  
    const srcs = useMemo(() => {
      if (!currency) {
        return [unknown]
      }
      try{
      if (currency.isNative || (currency.symbol==="WETH" && currency.equals(WETH9[currency.chainId]))) {
        return [LOGO[currency.chainId], unknown]
      }  
      }catch(e){
        console.log("cannot read property chainID")
      }
      
  
      if (currency.isToken) {
        const defaultUrls = [...getCurrencyLogoUrls(currency)]
        if (currency instanceof WrappedTokenInfo) {
          return [...uriLocations, ...defaultUrls, unknown]
        }
        return defaultUrls
      }
    }, [currency, uriLocations])
  
    return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} squared={squared} {...rest} style={style} />
  }
  
  export default CurrencyLogo
  