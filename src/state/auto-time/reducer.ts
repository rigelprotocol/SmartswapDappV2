import { createAction } from "@reduxjs/toolkit";


export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string | undefined }>('autotime/selectCurrency')
export const typeInput = createAction<{ field: Field; typedValue: string }>('autotime/typeInput')
export const switchCurrencies = createAction<void>('autotime/switchCurrencies')
export const replaceAutoTimeState = createAction<{
    field: Field
    typedValue: string
    inputCurrencyId?: string
    outputCurrencyId?: string
    recipient: string | null
}>('autotime/replaceAutoTimeState')
