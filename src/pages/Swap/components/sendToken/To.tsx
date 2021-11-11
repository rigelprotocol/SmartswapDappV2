import React,{ useState, useCallback } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';
import { useSwapActionHandlers,useDerivedSwapInfo,useSwapState } from '../../../../state/swap/hooks';
import { Field } from '../../../../state/swap/actions';
const To = () => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const [tokenModal, setTokenModal] = useState(false);
  const {onCurrencySelection,onUserInput} = useSwapActionHandlers()
  const { independentField, typedValue } = useSwapState()
  const dependentField: Field = independentField === Field.OUTPUT ? Field.INPUT : Field.OUTPUT
  const { currencies } = useDerivedSwapInfo()
  const handleInputSelect = useCallback(
    (outputCurrency) => {
      
    onCurrencySelection(Field.OUTPUT, outputCurrency) 
      setTokenModal((state) =>!state)
    },
    [onCurrencySelection],
    // [],
  )
  
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    // [dependentField]: showWrap
    //   ? parsedAmounts[independentField]?.toExact() ?? ''
    //   : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    [dependentField]: typedValue+3
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
        onCurrencySelect={handleInputSelect}
        currency={currencies[Field.OUTPUT]}
        otherCurrency={currencies[Field.INPUT]}
        tokenModal={tokenModal}
        setToken={()=>setTokenModal((state) =>!state)}
        onUserInput={handleTypeInput}
        value={formattedAmounts[Field.OUTPUT]}
        max={false} />
      </Box>
    </>
  );
};

export default To;