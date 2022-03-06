import React, { useState, useCallback } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import InputSelector from './InputSelector';
import { Field } from '../../../../state/swap/actions';
import { Currency } from "@uniswap/sdk-core";


interface ToProps {
  onUserOutput: (value: string) => void,
  onCurrencySelection: Function,
  currency: Currency | undefined,
  otherCurrency: Currency | undefined,
  value: string,
  display?: boolean,
  disable?: boolean,
}


const To: React.FC<ToProps> = ({
  onCurrencySelection,
  currency,
  otherCurrency,
  onUserOutput,
  value,
  display,
  disable
}) => {
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const [tokenModal, setTokenModal] = useState(false);
  const handleInputSelect = useCallback(
    (outputCurrency) => {

      onCurrencySelection(Field.OUTPUT, outputCurrency);
      setTokenModal((state) => !state)
    },
    [onCurrencySelection],
    // [],
  );


  return (
    <>
      <Box
        h="102px"
        mb={4}
        mt={4}
        borderRadius="6px"
        border={display ? "0" : "1px"}
        borderColor={borderColor}
        className='SelectToken'
        width="100%"
      >
        <InputSelector
          onCurrencySelect={handleInputSelect}
          currency={currency}
          display={display}
          otherCurrency={otherCurrency}
          tokenModal={tokenModal}
          setToken={() => setTokenModal((state) => !state)}
          onUserInput={onUserOutput}
          value={value}
          max={false}
          disable={disable} />

      </Box>
    </>
  );
};

export default To;