import { createReducer } from '@reduxjs/toolkit';
import {
  Field,
  resetMintState,
  typeInput,
  selectCurrency,
  replaceMintState,
} from './actions';

export interface MintState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly recipient: string | null;
  readonly otherTypedValue: string;
}

export const initialState: MintState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: null,
  otherTypedValue: '',
};

// const initialState: MintState = {
//   independentField: Field.INPUT,
//   typedValue: '',
//   otherTypedValue: ''
// }

// export default createReducer<MintState>(initialState, (builder) =>
//   builder
//     .addCase(resetMintState, () => initialState)
//     .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
//       return {
//         ...state,
//         independentField: field,
//         typedValue,
//       };
//     })
//     .addCase(replaceMintState, (state, { payload: { inputCurrencyId } }) => {
//       return {
//         ...state,
//         [Field.CURRENCY_A]: {
//           currencyId: inputCurrencyId,
//         },
//       };
//     })
//     .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
//       const otherField =
//         field === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;
//       if (currencyId === state[otherField].currencyId) {
//         // the case where we have to swap the order
//         return {
//           ...state,
//           independentField:
//             state.independentField === Field.CURRENCY_A
//               ? Field.CURRENCY_B
//               : Field.CURRENCY_A,
//           [field]: { currencyId },
//           [otherField]: { currencyId: state[field].currencyId },
//         };
//       }
//       // normal case
//       return {
//         ...state,
//         [field]: { currencyId },
//       };
//     })
// );

export default createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(replaceMintState, (state, { payload: { inputCurrencyId } }) => {
      return {
        ...state,
        [Field.INPUT]: {
          currencyId: inputCurrencyId,
        },
      };
    })
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
    .addCase(typeInput, (state, { payload: { field, typedValue, no } }) => {
      if (!no) {
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          };
        } else {
          return {
            ...state,
            independentField: field,
            typedValue,
            otherTypedValue: state.typedValue,
          };
        }
      } else {
        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: '',
        };
      }
    })
);
