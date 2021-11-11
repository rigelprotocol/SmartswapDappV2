import React,{useCallback, useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';
import { useSwapActionHandlers,useDerivedSwapInfo,useSwapState } from '../../../../state/swap/hooks';
import { Field } from '../../../../state/swap/actions';
import { Currency } from '@uniswap/sdk-core';
const From = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const [tokenModal, setTokenModal] = useState(false);
  const {onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const { currencies,getMaxValue } = useDerivedSwapInfo()
  const { independentField, typedValue } = useSwapState()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const handleInputSelect = useCallback(
    (inputCurrency) => {
    onCurrencySelection(Field.INPUT, inputCurrency) 
      setTokenModal((state) =>!state)
    },
    [onCurrencySelection],
  )
  const handleMaxInput = async (currency:Currency) =>
     { 
 let value = await getMaxValue(currency)
 onUserInput(Field.INPUT, value)
    }
    const handleTypeInput = useCallback(
      (value: string) => {
        onUserInput(Field.INPUT, value)
      },
      [onUserInput],
    )
    const formattedAmounts = {
      [independentField]: typedValue,
      // [dependentField]: showWrap
      //   ? parsedAmounts[independentField]?.toExact() ?? ''
      //   : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
      [dependentField]:'67'
    }
  return (
    <>
      <Box
        h="102px"
        mb={4}
        mt={4}
        borderRadius="6px"
        border="1px"
        borderColor={borderColor}
      >
        <InputSelector 
        onUserInput={handleTypeInput}
        onCurrencySelect={handleInputSelect}
        currency={currencies[Field.INPUT]}
        otherCurrency={currencies[Field.OUTPUT]}
        tokenModal={tokenModal}
        onMax={handleMaxInput}
        setToken={()=>setTokenModal((state) =>!state)}
        value={formattedAmounts[Field.INPUT]}
        max />
      </Box>
    </>
  );
};

export default From;