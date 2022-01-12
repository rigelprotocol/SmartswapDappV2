import { createAction } from '@reduxjs/toolkit';

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{
  field: Field;
  currencyId: string | undefined;
}>('mint/selectCurrency');
export const typeInput =
  createAction<{ field: Field; typedValue: string; no: boolean }>(
    'mint/typeInputMint'
  );
export const resetMintState = createAction<void>('mint/resetMintState');
export const replaceMintState = createAction<{ inputCurrencyId?: string }>(
  'mint/replaceMintState'
);
