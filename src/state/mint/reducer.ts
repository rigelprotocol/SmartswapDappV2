import { createReducer } from '@reduxjs/toolkit'
import { Field, resetMintState, typeInput, selectCurrency, replaceMintState } from './actions'

export interface MintState {
    readonly independentField: Field
    readonly typedValue: string
    readonly [Field.CURRENCY_A]: {
        readonly currencyId: string | undefined
    }
    readonly [Field.CURRENCY_B]: {
        readonly currencyId: string | undefined
    }
    readonly recipient: string | null
}

export const initialState: MintState = {
    independentField: Field.CURRENCY_A,
    typedValue: '',
    [Field.CURRENCY_A]: {
        currencyId: '',
    },
    [Field.CURRENCY_B]: {
        currencyId: '',
    },
    recipient: null,
}

export default createReducer<MintState>(initialState, (builder) =>
    builder
        .addCase(resetMintState, () => initialState)
        .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
            return {
                ...state,
                independentField: field,
                typedValue,
            }
        }).addCase(
            replaceMintState,
            (state, { payload: { inputCurrencyId } }) => {
                return {
                    ...state,
                    [Field.CURRENCY_A]: {
                        currencyId: inputCurrencyId,
                    }
                }
            })
        .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
            const otherField = field === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A
            if (currencyId === state[otherField].currencyId) {
                // the case where we have to swap the order
                return {
                    ...state,
                    independentField: state.independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A,
                    [field]: { currencyId },
                    [otherField]: { currencyId: state[field].currencyId }
                }
            }
            // normal case
            return {
                ...state,
                [field]: { currencyId },
            }
        })
)




