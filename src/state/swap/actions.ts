import { createAction } from "@reduxjs/toolkit";


export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}

  export const selectCurrency = createAction<{ field: Field; currencyId: string | undefined }>('swap/selectCurrency')
  export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
  export const switchCurrencies = createAction<void>('swap/switchCurrencies')
  export const replaceSwapState = createAction<{ 
    field: Field
    typedValue: string
    inputCurrencyId?: string
    outputCurrencyId?: string
    recipient: string | null }>('swap/replaceSwapState')
