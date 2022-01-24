import React, { useState, useCallback } from 'react';
import {
  useSwapActionHandlers,
  useDerivedSwapInfo
} from '../../../state/swap/hooks';
import { Field } from '../../../state/swap/actions';
import Selector from './Selector';
import { Currency } from '@uniswap/sdk-core';

type FromInputProps = {
  setTokenA: React.Dispatch<React.SetStateAction<Currency | undefined>>;
};

const From = ({ setTokenA }: FromInputProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const { onCurrencySelection } = useSwapActionHandlers();
  const { currencies } = useDerivedSwapInfo();
  // const { independentField } = useSwapState();
  // const dependentField: Field =
  //   independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
      setTokenA(inputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
  );

  return (
    <Selector
      onCurrencySelect={handleInputSelect}
      currency={currencies[Field.INPUT]}
      otherCurrency={currencies[Field.OUTPUT]}
      tokenModal={tokenModal}
      setToken={() => setTokenModal((state) => !state)}
    />
  );
};

export default From;
