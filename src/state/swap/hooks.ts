import { AppDispatch, RootState } from '../index'
import { provider } from '../../utils/utilsFunctions'
import { useCallback,useEffect,useState } from "react"
import { Field,selectCurrency,typeInput,replaceSwapState } from "./actions"
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch, useSelector } from 'react-redux'
import { Currency } from '@uniswap/sdk-core'
import { useNativeBalance } from "../../utils/hooks/useBalances";
import { getERC20Token } from "../../utils/utilsFunctions";
import { isAddress } from '../../utils'
import { ethers } from 'ethers'
import JSBI from 'jsbi'
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

function parseCurrencyFromURLParameter(parse :any) {
  return parse 
}

function queryParametersToSwapState(chainId:number |undefined) {
  let symbol= SupportedChainSymbols[chainId ?? 56]
  let inputCurrency = parseCurrencyFromURLParameter(symbol) ?? 'BNB'
  // let outputCurrency = parseCurrencyFromURLParameter()
  // let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  // let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  // if (inputCurrency === outputCurrency) {
  //   if (typeof parsedQs.outputCurrency === 'string') {
  //     inputCurrency = ''
  //   } else {
  //     outputCurrency = ''
  //   }
  // }

  // const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency ,
    },
    // [Field.OUTPUT]: {
    //   currencyId: outputCurrency,
    // },
    // typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    // independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    // recipient,
  }
}


// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
const { chainId,account } = useActiveWeb3React()
const [,Symbol] = useNativeBalance();
const dispatch = useDispatch<AppDispatch>()
// const parsedQs = useParsedQueryString()
const [result, setResult] = useState<
    { inputCurrencyId: string | undefined;  } | undefined
  >()

  useEffect(()=>{
if(!chainId) return

// if URL is empty, use default token
const parsed = queryParametersToSwapState(chainId)
    dispatch(
      replaceSwapState({
        inputCurrencyId:parsed[Field.INPUT].currencyId
      })
    )
    // setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId })
  },[dispatch,chainId,account])
  return result
  }


  