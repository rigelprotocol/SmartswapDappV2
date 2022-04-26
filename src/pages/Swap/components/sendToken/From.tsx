import React, { useCallback, useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';
import { Field } from '../../../../state/swap/actions';
import { Currency } from "@uniswap/sdk-core";

interface FromProps {
  onUserInput: (value: string) => void,
  onCurrencySelection: Function,
  currency: Currency | undefined,
  otherCurrency: Currency | undefined,
  onMax?: () => void,
  value: string,
  disable?: boolean,
  onHover?: ()=>void,
  placeholder?: string
}

const From: React.FC<FromProps> = ({
  onUserInput,
  onCurrencySelection,
  currency,
  otherCurrency,
  onMax,
  value,
  disable,
  placeholder,
  onHover,
}) => {


  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const [tokenModal, setTokenModal] = useState(false);
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
      setTokenModal((state) => !state)
    },
    [onCurrencySelection],
  );


  return (
    <>
      <Box
        h="102px"
        mb={4}
        mt={4}
        borderRadius="6px"
        border="1px"
        borderColor={borderColor}
        className='FromToken'
      >
        <InputSelector
          onUserInput={onUserInput}
          onCurrencySelect={handleInputSelect}
          currency={currency}
          otherCurrency={otherCurrency}
          tokenModal={tokenModal}
          onMax={onMax}
          setToken={() => setTokenModal((state) => !state)}
          value={value}
          max
          disable={disable} 
          placeholder={placeholder}
          onHover={onHover}
          />
      </Box>
    </>
  );
};

export default From;