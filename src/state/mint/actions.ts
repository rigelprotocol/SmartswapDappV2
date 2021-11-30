import { createAction } from '@reduxjs/toolkit'

export enum Field {
    CURRENCY_A = 'CURRENCY_A',
    CURRENCY_B = 'CURRENCY_B',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string | undefined }>('mint/selectCurrency')
export const typeInput = createAction<{ field: Field; typedValue: string }>('mint/typeInputMint')
export const resetMintState = createAction<void>('mint/resetMintState')
export const replaceMintState = createAction<{ inputCurrencyId?:string; }>('swap/replaceMintState')