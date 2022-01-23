
import { MIN_BNB } from './constants'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { ethers } from 'ethers'
/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(value:any,currency:Currency|undefined ) {
  if (!currency) return undefined
  if (currency.isNative) {
   
    if (JSBI.greaterThan(value, MIN_BNB)) {
      const subtract = JSBI.subtract(value, MIN_BNB)
     const toNumber = JSBI.toNumber(subtract)
      return  ethers.utils.formatEther(toNumber.toString())
    }else{
       return "0"
    }
  }
  return value
}
