import React, { useState, useCallback, useEffect } from 'react';
import {
  useSwapActionHandlers,
  useDerivedSwapInfo
} from '../../../state/swap/hooks';
import { Field } from '../../../state/swap/actions';
import Selector from './Selector';
import { Currency } from '@uniswap/sdk-core';
import { useWeb3React } from '@web3-react/core';

type ToInputProps = {
  setTokenB: React.Dispatch<React.SetStateAction<Currency | undefined>>;
  TokenB: Currency | undefined;
};

const From = ({ setTokenB, TokenB }: ToInputProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const { onCurrencySelection } = useSwapActionHandlers();
  const { currencies } = useDerivedSwapInfo();
  const { chainId } = useWeb3React();
  // const { independentField } = useSwapState();
  // const dependentField: Field =
  //   independentField === Field.OUTPUT ? Field.INPUT : Field.OUTPUT;
  const handleInputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      setTokenB(outputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
  );

  useEffect(() => {
    setTokenB(undefined);
  }, [chainId, setTokenB]);

  return (
    <Selector
      onCurrencySelect={handleInputSelect}
      currency={TokenB}
      otherCurrency={currencies[Field.INPUT]}
      tokenModal={tokenModal}
      setToken={() => setTokenModal((state) => !state)}
    />
  );
};

export default From;
