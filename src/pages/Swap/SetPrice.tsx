import React, { useCallback, useMemo } from 'react';
import ShowDetails from './components/details/ShowDetails';
import History from './components/history/History';
import { VectorIcon, ExclamationIcon, SwitchIcon } from '../../theme/components/Icons';
import To from './components/sendToken/To';
import From from './components/sendToken/From';
import SwapSettings from './components/sendToken/SwapSettings';
import {
  Box,
  Flex,
  Input,
  Text,
  Center,
  Spacer,
  Button,
  useColorModeValue,
  useMediaQuery
} from '@chakra-ui/react';
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { Field } from '../../state/swap/actions';
import { maxAmountSpend } from '../../utils/maxAmountSpend';

const SetPrice = () => {
  const [isMobileDevice] = useMediaQuery('(max-width: 750px)');
  const borderColor = useColorModeValue('#DEE6ED', '#324D68');
  const iconColor = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const lightmode = useColorModeValue(true, false);
  const buttonBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const color = useColorModeValue('#999999', '#7599BD');

  const { onCurrencySelection, onUserInput, onSwitchTokens } = useSwapActionHandlers();

  const {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    inputError,
    showWrap,
    pathSymbol,
    pathArray,
  } = useDerivedSwapInfo();

  const { independentField, typedValue } = useSwapState();
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: typedValue,
          [Field.OUTPUT]: typedValue,
        }
        : {
          [Field.INPUT]:
            independentField === Field.INPUT ? parsedAmount : bestTrade,
          [Field.OUTPUT]:
            independentField === Field.OUTPUT ? parsedAmount : bestTrade,
        },
    [independentField, parsedAmount, showWrap, bestTrade]
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField] ?? '' //?.toExact() ?? ''
      : parsedAmounts[dependentField] ?? '', //?.toSignificant(6) ?? '',
  };

  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT]);
    const maxAmountInput = maxAmountSpend(value, currencies[Field.INPUT]);
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput);
    }
  };
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  return (
    <Box fontSize="xl">
      <Flex
        minH="100vh"
        zIndex={1}
        mt={6}
        justifyContent="center"
        flexWrap="wrap"
      >
        <Box mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <ShowDetails />
        </Box>

        <Box
          mx={4} w={['100%', '100%', '45%', '29.5%']} mb={4}
          borderColor={borderColor} borderWidth="1px"
          borderRadius="6px" pl={3} pr={3}
          h="550px"
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
          <Flex justifyContent="center" onClick={onSwitchTokens}>
            <SwitchIcon />
          </Flex>
          <To
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onUserOutput={handleTypeOutput}
          />
          <Flex>
            <Text fontSize="14px" color={iconColor} mr={2}>
              Set Price
            </Text>
            <ExclamationIcon />
          </Flex>

          <Input placeholder="0.00" size="lg" borderRadius={4} borderColor={borderColor} />

          <Flex mt={5}>
            <Center borderColor={iconColor} borderWidth="1px" borderRadius={4} w="20px" h="20px">
              <VectorIcon />
            </Center>
            <Spacer />
            <Text fontSize="14px" mr={2} color={textColorOne}>
              1 RGP = 1.34566 USDT
            </Text>
            <ExclamationIcon />
          </Flex>

          <Box mt={5}>
            <Button
              w="100%"
              borderRadius="6px"
              border={lightmode ? '2px' : 'none'}
              borderColor={borderColor}
              h="48px"
              p="5px"
              color={color}
              bgColor={buttonBgcolor}
              fontSize="18px"
              boxShadow={lightmode ? 'base' : 'lg'}
              _hover={{ bgColor: buttonBgcolor }}
            >
              Enter Percentage
            </Button>
          </Box>

        </Box>

        <Box mx={5} w={['100%', '100%', '45%', '29.5%']} mb={4}>
          <History />
        </Box>

      </Flex>
    </Box>
  )
}

export default SetPrice
