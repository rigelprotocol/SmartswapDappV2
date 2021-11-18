import React, { useState, useCallback } from 'react';
import {
  useSwapActionHandlers,
  useDerivedSwapInfo,
  useSwapState,
} from '../../../state/swap/hooks';
import { Field } from '../../../state/swap/actions';
import Selector from './Selector';
import { Currency } from '@uniswap/sdk-core';

type ToInputProps = {
  setTokenB: React.Dispatch<React.SetStateAction<Currency | undefined>>;
};

const From = ({ setTokenB }: ToInputProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const { onCurrencySelection } = useSwapActionHandlers();
  const { currencies } = useDerivedSwapInfo();
  const { independentField } = useSwapState();
  const dependentField: Field =
    independentField === Field.OUTPUT ? Field.INPUT : Field.OUTPUT;
  const handleInputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      setTokenB(outputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
  );

  return (
    <Selector
      onCurrencySelect={handleInputSelect}
      currency={currencies[Field.OUTPUT]}
      otherCurrency={currencies[Field.INPUT]}
      tokenModal={tokenModal}
      setToken={() => setTokenModal((state) => !state)}
    />
  );
};

export default From;
