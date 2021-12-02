import { AppDispatch, RootState } from '../index'
import { provider } from '../../utils/utilsFunctions'
import { useCallback,useEffect,useState } from "react"
import { Field,selectCurrency,typeInput,replaceSwapState } from "./actions"
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React'
import { ParsedQs } from 'qs'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch, useSelector } from 'react-redux'
import { Currency } from '@uniswap/sdk-core'
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { getERC20Token } from "../../utils/utilsFunctions";
import { isAddress } from '../../utils'
import { ethers } from 'ethers'
import JSBI from 'jsbi'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { SupportedChainSymbols } from '../../utils/constants/chains'
export function useSwapState(): RootState['swap'] {
    return useSelector<RootState,RootState['swap']>((state) => state.swap)
}

export function useSwapActionHandlers(): {
    onCurrencySelection : (field:Field,currency:Currency) => void,
    onUserInput: (field: Field, typedValue: string) => void
} {
  const {chainId,account} = useActiveWeb3React()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()
  
  const [Balance,Symbol] = useNativeBalance();
    const dispatch = useDispatch<AppDispatch>()
    const onCurrencySelection = useCallback((field:Field,currency: Currency) => {
      
        dispatch(
            selectCurrency({
                field,
                currencyId: currency.isToken ? currency.address : currency.isNative ? currency.symbol : ""
            })
        )
    },[dispatch])

    const onUserInput = useCallback(
        (field: Field, typedValue: string) => {
          dispatch(typeInput({ field, typedValue }))
        },
        [dispatch],
      )
    return {
        onCurrencySelection,
        onUserInput
    }
}

export function useDerivedSwapInfo(): {
    currencies: { [field in Field]?: Currency },
    getMaxValue:any

} {
    const { account } = useActiveWeb3React();
    const [Balance] = useNativeBalance();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()
    const inputCurrency = useCurrency(inputCurrencyId)
    const outputCurrency = useCurrency(outputCurrencyId)

    const currencies: { [field in Field]?: Currency } = {
        [Field.INPUT]: inputCurrency ?? undefined,
        [Field.OUTPUT]: outputCurrency ?? undefined,
      }

     const getMaxValue = async (currency:Currency)  => {
        if(currency.isNative){
            // return Balance === "0.0000" ? "0" :  Balance
            const Provider = await provider();
          const balance = await Provider?.getBalance(account as string);
         return balance ? JSBI.BigInt(balance.toString()) : undefined

          }else if(isAddress(currency.address)){
            const token = await getERC20Token(currency.address ? currency.address : "");
          const balance = await token.balanceOf(account);
          const amount =ethers.utils.formatEther(balance)
          return amount ===  "0.0" ? "0" : parseFloat(amount).toFixed(4)
          
            }
     } 

return {
    currencies,
    getMaxValue
}    
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

function parseCurrencyFromURLParameter(urlParam: any): string {
   if (typeof urlParam === 'string') {
   const valid = isAddress(urlParam)
   console.log({urlParam,valid})
  if (valid) return valid
    if (urlParam.toUpperCase() === 'BNB') return 'BNB'
    if (valid === false) return urlParam
  }
  return urlParam ?? ''
}
function queryParametersToSwapState(parsedQs:ParsedQs) {
  let symbol
  let inputCurrency
  console.log({parsedQs})
  if(typeof parsedQs === "string"){
    symbol= SupportedChainSymbols[parsedQs ?? 56]
    console.log({symbol})
  inputCurrency = parseCurrencyFromURLParameter(symbol) ?? 'BNB'
  }else{
 inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  }
  
  console.log(parsedQs.recipient)
 
  console.log({inputCurrency})
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }
  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  }
}


// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
const { chainId,account } = useActiveWeb3React()
const [,Symbol] = useNativeBalance();
const dispatch = useDispatch<AppDispatch>()
const parsedQs = useParsedQueryString()
const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined;  } | undefined
  >()

  useEffect(()=>{
if(!chainId) return
console.log({parsedQs})
// if URL is empty, use default token
const parsed = queryParametersToSwapState(parsedQs ?? chainId)
    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      })
    )
    // setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId })
  },[dispatch,chainId,account])
  return result
  }


  