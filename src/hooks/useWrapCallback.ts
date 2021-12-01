import { Currency } from '@uniswap/sdk-core'
import { useMemo } from 'react'

import { tryParseAmount } from '../state/swap/hooks'
import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";

export enum WrapType {
    NOT_APPLICABLE,
    WRAP,
    UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
    inputCurrency: Currency | undefined | null,
    outputCurrency: Currency | undefined | null,
    typedValue: string | undefined
): { wrapType: WrapType } {
    const { chainId, account } = useActiveWeb3React();
    // we can always parse the amount typed as the input currency, since wrapping is 1:1


    return useMemo(() => {
        if ( !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE;


        if (inputCurrency.isNative ) {
            return {
                wrapType: WrapType.WRAP,

            }
        } else if (outputCurrency.isNative) {
            return {
                wrapType: WrapType.UNWRAP,
            }
        } else {
            return NOT_APPLICABLE
        }
    }, [ chainId, inputCurrency, outputCurrency])
}
