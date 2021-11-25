import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Box, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import SwapSettings from './SwapSettings';
import From from './From';
import To from './To';
import { SwitchIcon } from '../../../../theme/components/Icons';
import {useDefaultsFromURLSearch, useSwapActionHandlers} from '../../../../state/swap/hooks';
import { useCurrency } from '../../../../hooks/Tokens';
import {useDerivedSwapInfo} from "../../../../state/swap/hooks";
import ConfirmModal from "../../modals/confirmModal";
import {useSwapState} from "../../../../state/swap/hooks";
import {Field} from "../../../../state/swap/actions";
import useWrapCallback, {WrapType} from "../../../../hooks/useWrapCallback";
import {maxAmountSpend} from "../../../../utils/maxAmountSpend";


const SendToken = () => {

  const loadedUrlParams = useDefaultsFromURLSearch();
  
 // token warning stuff
 const [loadedInputCurrency] = [
  useCurrency(loadedUrlParams?.inputCurrencyId),
  // useCurrency(loadedUrlParams?.outputCurrencyId),
];
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const color = useColorModeValue('#999999', '#7599BD');
  const lightmode = useColorModeValue(true, false);
  const switchBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');

  const [showModal, setShowModal] = useState(false);

  const {onCurrencySelection, onUserInput } = useSwapActionHandlers();
  const { currencies,getMaxValue, bestTrade, parsedAmount, inputError } = useDerivedSwapInfo();
  const { independentField, typedValue } = useSwapState();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;



  const {wrapType} = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;

  const parsedAmounts = useMemo(
      () =>
          showWrap
              ? {
                [Field.INPUT]: parsedAmount,
                [Field.OUTPUT]: parsedAmount,
              }
              :
              {
                [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : bestTrade,
                [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : bestTrade,
              },
      [independentField, parsedAmount, showWrap, bestTrade]
  );


  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT]);
    const maxAmountInput = maxAmountSpend(value,currencies[Field.INPUT]);
    if(maxAmountInput){
      onUserInput(Field.INPUT, maxAmountInput);

    }
  };
  const handleTypeInput = useCallback(
      (value: string) => {
        onUserInput(Field.INPUT, value)
      },
      [onUserInput],
  );

    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput],
    );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
        ? parsedAmounts[independentField] ?? ''//?.toExact() ?? ''
        : parsedAmounts[dependentField] ?? '' //?.toSignificant(6) ?? '',
  };

  
  return (
    <div>
      <Box
        border="1px"
        borderColor={borderColor}
        borderRadius="6px"
        h="420px"
        pl={3}
        pr={3}
      >
        <SwapSettings />
        <From
            onUserInput={handleTypeInput}
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.INPUT]}
            otherCurrency={currencies[Field.OUTPUT]}
            onMax={handleMaxInput}
            value={formattedAmounts[Field.INPUT]}
        />
        <Flex justifyContent="center">
          <SwitchIcon />
        </Flex>
        <To
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onUserOutput={handleTypeOutput}
        />

        <Flex alignItems="center">
          <Button
            w="100%"
            borderRadius="6px"
            border={lightmode ? '2px' : 'none'}
            borderColor={borderColor}
            h="48px"
            p="5px"
            mt={1}
            color={color}
            bgColor={buttonBgcolor}
            fontSize="18px"
            boxShadow={lightmode ? 'base' : 'lg'}
            _hover={{ bgColor: buttonBgcolor }}
            disabled={inputError !== undefined}
            onClick={() => setShowModal(state => !state)}
          >
            {inputError ? inputError : 'Approve Transaction'}
          </Button>
        </Flex>
        <ConfirmModal
            showModal={showModal}
            setShowModal={setShowModal}
            from={currencies[Field.INPUT]?.symbol}
            to={currencies[Field.OUTPUT]?.symbol}
            title={'Confirm Swap'}
        />
      </Box>
    </div>
  );
};

export default SendToken;
