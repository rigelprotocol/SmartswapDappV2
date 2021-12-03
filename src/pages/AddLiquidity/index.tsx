import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Field } from '../../state/mint/actions';
import { RouteComponentProps } from 'react-router-dom';
import TransactionSettings from '../../components/TransactionSettings';
import {
  Box,
  Flex,
  Spacer,
  Text,
  VStack,
  Button,
  Heading,
  useColorModeValue,
  Divider,
  Center,
} from '@chakra-ui/react';
import { TimeIcon, ArrowBackIcon, AddIcon } from '@chakra-ui/icons';
import { useDerivedMintInfo, useMintState } from '../../state/mint/hooks';
import { useWeb3React } from '@web3-react/core';
import OutputCurrecy from './AddLquidityInputs/OutputCurrecy';
import InputCurrency from './AddLquidityInputs/InputCurrency';
import { useMintActionHandlers } from '../../state/mint/hooks';
import {
  useIsPoolsAvailable,
  usePoolShare,
  usePricePerToken,
  useAllowance,
  usePriceForNewPool,
} from '../../utils/hooks/usePools';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { GetAddressTokenBalance } from '../../state/wallet/hooks';

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const infoBg = ('#EBF6FE', '#EAF6FF');
  const genBorder = useColorModeValue('#DEE6ED', '#324D68');
  const bgColor = useColorModeValue('#F2F5F8', '#213345');
  const topIcons = useColorModeValue('#666666', '#DCE6EF');
  const textColorOne = useColorModeValue('#333333', '#F1F5F8');
  const btnTextColor = useColorModeValue('#999999', '#7599BD');
  const approveButtonBgColor = useColorModeValue('#319EF6', '#4CAFFF');
  const approveButtonColor = useColorModeValue('#FFFFFF', '#F1F5F8');
  const { independentField, typedValue, otherTypedValue } = useMintState();

  const { onCurrencySelection, onUserInput } = useMintActionHandlers();
  const {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    inputError,
    showWrap,
  } = useDerivedMintInfo();
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const { pairAvailable } = useIsPoolsAvailable(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  );

  const [balanceA, setBalanceA] = useState('');
  const [balanceB, setBalanceB] = useState('');

  // const [balanceA] = GetAddressTokenBalance(
  //   currencies[Field.INPUT] ?? undefined
  // );

  // const [balanceB] = GetAddressTokenBalance(
  //   currencies[Field.OUTPUT] ?? undefined
  // );

  const { priceAToB, priceBToA } = usePricePerToken(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  );

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
    [independentField, parsedAmount, showWrap, bestTrade, typedValue]
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: !pairAvailable
      ? otherTypedValue
      : showWrap
      ? parsedAmounts[independentField] ?? ''
      : parsedAmounts[dependentField] ?? '',
  };
  const { priceAperB, priceBperA } = usePriceForNewPool(
    formattedAmounts[Field.INPUT],
    formattedAmounts[Field.OUTPUT],
    pairAvailable
  );

  const { poolShare } = usePoolShare(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  );

  const { hasTokenABeenApproved, hasTokenBBeenApproved } = useAllowance(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    
  );

  // const [hasTokenABeenApproved, setHashasTokenABeenApproved] = useState(false);
  // const [hasTokenBBeenApproved, setHasTokenBBeenApproved] = useState(false);

  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.INPUT]);
    const maxAmountInput = maxAmountSpend(value, currencies[Field.INPUT]);
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput, pairAvailable);
    }
  };
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value, pairAvailable);
    },
    [onUserInput, pairAvailable]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value, pairAvailable);
    },
    [onUserInput, pairAvailable]
  );

  return (
    <Center m={8}>
      <Box
        maxW="496px"
        borderWidth="1px"
        borderRadius="md"
        borderColor={genBorder}
        overflow="hidden"
        alignItems="center"
        p={4}
      >
        <Flex>
          <ArrowBackIcon
            onClick={() => history.goBack()}
            w={6}
            h={6}
            color={topIcons}
            cursor="pointer"
          />
          <Spacer />
          <Heading as="h4" size="md">
            Add Liquidity
          </Heading>
          <Spacer />
          <TransactionSettings />
          <TimeIcon w={6} h={7} color={topIcons} />
        </Flex>
        <Box bg={infoBg} borderRadius="md" p={4} mt={4} mb={5}>
          <Text color="#319EF6" fontWeight="400" fontSize="14px">
            Tip: When you add liquidity, you will receive pool tokens
            representing your position. These tokens automatically earn fees
            proportional to your share of the pool, and can be redeemed at any
            time.
          </Text>
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          pt={2}
          pb={2}
          borderColor={genBorder}
        >
          <InputCurrency
            onUserInput={handleTypeInput}
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.INPUT]}
            otherCurrency={currencies[Field.OUTPUT]}
            onMax={handleMaxInput}
            value={formattedAmounts[Field.INPUT]}
            setBalanceA={setBalanceA}
          />
        </Box>
        <Flex justifyContent="center">
          <Center
            w="40px"
            h="40px"
            bg={bgColor}
            borderWidth="3px"
            borderColor={genBorder}
            color="#333333"
            borderRadius="xl"
            mt={5}
            mb={5}
          >
            <AddIcon color={textColorOne} />
          </Center>
        </Flex>
        <Box
          borderRadius="md"
          border="1px solid #DEE6ED"
          pt={2}
          pb={2}
          borderColor={genBorder}
        >
          <OutputCurrecy
            onCurrencySelection={onCurrencySelection}
            currency={currencies[Field.OUTPUT]}
            otherCurrency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onUserOutput={handleTypeOutput}
            setBalanceB={setBalanceB}
          />
        </Box>
        <Box
          borderRadius="md"
          borderWidth="1px"
          borderColor={genBorder}
          mt="5"
          mb="3"
        >
          <Text p="4" fontWeight="400">
            Prices & pool share
          </Text>
          <Divider orientation="horizontal" borderColor={genBorder} />
          <Flex p="4">
            <VStack>
              <Text color={textColorOne}>
                {priceBToA && pairAvailable
                  ? parseFloat(priceBToA).toFixed(6)
                  : !pairAvailable && priceBperA
                  ? priceBperA
                  : '-'}
              </Text>
              <Text color={topIcons}>
                {currencies[Field.INPUT]?.symbol} per{' '}
                {currencies[Field.OUTPUT]?.symbol}
              </Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>
                {priceAToB && pairAvailable
                  ? parseFloat(priceAToB).toFixed(6)
                  : priceAperB && !pairAvailable
                  ? priceAperB
                  : '-'}
              </Text>
              <Text color={topIcons}>
                {currencies[Field.OUTPUT]?.symbol} per{' '}
                {currencies[Field.INPUT]?.symbol}
              </Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>
                {priceAperB && priceBperA
                  ? '100%'
                  : poolShare
                  ? `${poolShare.toFixed(6)}% `
                  : '-'}
              </Text>
              <Text color={topIcons}>Share of Pool</Text>
            </VStack>
          </Flex>
        </Box>
        <Button
          size="lg"
          height="48px"
          width="200px"
          bgColor={approveButtonBgColor}
          color={approveButtonColor}
          w="100%"
          mb={3}
          _hover={{ bgColor: 'none' }}
          _active={{ bgColor: 'none' }}
          display={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            !hasTokenABeenApproved
              ? undefined
              : 'none'
          }
        >
          {`Approve ${currencies[Field.INPUT]?.symbol}`}
        </Button>
        <Button
          size="lg"
          height="48px"
          width="200px"
          mb={3}
          bgColor={approveButtonBgColor}
          color={approveButtonColor}
          w="100%"
          _hover={{ bgColor: 'none' }}
          _active={{ bgColor: 'none' }}
          display={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            !hasTokenBBeenApproved
              ? undefined
              : 'none'
          }
        >
          {`Approve ${currencies[Field.OUTPUT]?.symbol}`}
        </Button>
        <Button
          size="lg"
          height="48px"
          width="200px"
          border="2px"
          borderColor={genBorder}
          color={btnTextColor}
          w="100%"
          _hover={{ bgColor: 'none' }}
          _active={{ bgColor: 'none' }}
          display={
            formattedAmounts[Field.INPUT] && formattedAmounts[Field.OUTPUT]
              ? 'none'
              : undefined
          }
        >
          Enter An Amount
        </Button>
        <Button
          size="lg"
          height="48px"
          width="200px"
          display={
            formattedAmounts[Field.INPUT] && formattedAmounts[Field.OUTPUT]
              ? undefined
              : 'none'
          }
          disabled={
            !hasTokenBBeenApproved ||
            !hasTokenABeenApproved ||
            parseFloat(formattedAmounts[Field.INPUT]) > parseFloat(balanceA) ||
            parseFloat(formattedAmounts[Field.OUTPUT]) > parseFloat(balanceB)
          }
          border={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? ''
              : '2px'
          }
          borderColor={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? ''
              : genBorder
          }
          bgColor={
            formattedAmounts[Field.INPUT] &&
            formattedAmounts[Field.OUTPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? approveButtonBgColor
              : ''
          }
          color={
            formattedAmounts[Field.OUTPUT] &&
            formattedAmounts[Field.INPUT] &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? approveButtonColor
              : btnTextColor
          }
          // color={btnTextColor}
          w="100%"
          _hover={{ bgColor: 'none' }}
          _active={{ bgColor: 'none' }}
        >
          Confirm Liquidity Add
        </Button>
      </Box>
    </Center>
  );
}
