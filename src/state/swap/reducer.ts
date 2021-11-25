import { createReducer } from "@reduxjs/toolkit";
import {Field, selectCurrency, typeInput, replaceSwapState} from "./actions";
export interface SwapState {
    readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
    independentField: Field.INPUT,
    typedValue: '',
    [Field.INPUT]: {
      currencyId: '',
    },
    [Field.OUTPUT]: {
      currencyId: '',
    },
    recipient: null,
  };

  export default createReducer<SwapState>(initialState,(builder) => 
    builder
    .addCase(
      replaceSwapState,
      (state, { payload: { inputCurrencyId } }) => {
        return {
          ...state,
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          }
        }
      })
    .addCase(selectCurrency,(state,{payload:{currencyId, field}}) => {
        const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
        if (currencyId === state[otherField].currencyId) {
            // the case where we have to swap the order
            return {
                ...state,
               independentField :state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
               [field]: { currencyId },
               [otherField]: { currencyId:state[field].currencyId }
            }
        }
        // normal case
        return {
            ...state,
            [field]: { currencyId },
        }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
  )