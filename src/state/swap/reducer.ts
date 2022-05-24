import { createReducer } from "@reduxjs/toolkit";
import {
  Field,
  selectCurrency,
  typeInput,
  replaceSwapState,
  switchCurrencies,
  selectMarketFactory,
  selectMarketRouterAddress
} from "./actions";
export interface SwapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null;
  readonly percentageChange: string | null;
  marketFactory: string | undefined,
  marketRouterAddress: string | undefined
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: "",
  [Field.INPUT]: {
    currencyId: "",
  },
  [Field.OUTPUT]: {
    currencyId: "",
  },
  recipient: null,
  percentageChange:"0",
  marketFactory:"",
  marketRouterAddress:""
};

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (
        state,
        {
          payload: {
            typedValue,
            recipient,
            field,
            inputCurrencyId,
            outputCurrencyId,
          },
        }
      ) => {
        return {
          ...state,
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue,
          recipient,
          percentageChange:"0",
        };
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField:
            state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        };
      }
      // normal case
      return {
        ...state,
        [field]: { currencyId },
      };
    })
    .addCase(selectMarketFactory, (state, { payload: { marketFactory,marketRouterAddress } }) => {
       console.log({marketFactory,marketRouterAddress})
      // normal case
      return {
        ...state,
        marketFactory,
        marketRouterAddress
      };
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField:
          state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    })
);
