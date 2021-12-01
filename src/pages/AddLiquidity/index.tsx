import React, { useCallback, useEffect, useState } from 'react';
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
} from '../../utils/hooks/usePools';

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

  const { CURRENCY_A, CURRENCY_B } = useMintState();
  const { onCurrencySelection, onUserInput } = useMintActionHandlers();
  const { currencies } = useDerivedMintInfo();
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  const { pairAvailable } = useIsPoolsAvailable(
    currencies.CURRENCY_A,
    currencies.CURRENCY_B
  );

  // const { hasTokenABeenApproved, hasTokenBBeenApproved } = useAllowance(
  //   currencies.CURRENCY_A,
  //   currencies.CURRENCY_B
  // );

  const { hasTokenABeenApproved, hasTokenBBeenApproved } = useAllowance(
    currencies.CURRENCY_A,
    currencies.CURRENCY_B
  );

  console.log(pairAvailable);

  const { poolShare } = usePoolShare(
    currencies.CURRENCY_A,
    currencies.CURRENCY_B
  );

  const { priceAToB, priceBToA } = usePricePerToken(
    currencies.CURRENCY_A,
    currencies.CURRENCY_B
  );

  console.log(poolShare);
  console.log(inputValue, outputValue);

  // const  = (useAllowance(currencies.CURRENCY_A),useAllowance(currencies.CURRENCY_B))

  // const [allowanceA, allowanceB] = [
  //   useAllowance(currencies.CURRENCY_A) ?? undefined,
  //   useAllowance(currencies.CURRENCY_B) ?? undefined,
  // ];

  // console.log(allowanceA, allowanceB);

  // console.log(hasTokenABeenApproved, hasTokenBBeenApproved);

  useEffect(() => {
    const setUpUrl = () => {
      if (CURRENCY_A && CURRENCY_B) {
        history.push(
          `/add/${currencies.CURRENCY_A?.symbol}/${currencies.CURRENCY_B?.symbol}`
        );
        console.log(currencies.CURRENCY_B, CURRENCY_A);
      } else {
        history.push('/add');
      }
    };

    setUpUrl();
  }, [
    currencies.CURRENCY_A?.symbol,
    currencies.CURRENCY_B?.symbol,
    CURRENCY_A,
    CURRENCY_B,
    history,
  ]);
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
            setInputValue={setInputValue}
            setOutputValue={setOutputValue}
            pairAvailable={pairAvailable}
            inputValue={inputValue}
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
            setInputValue={setInputValue}
            setOutputValue={setOutputValue}
            pairAvailable={pairAvailable}
            outputValue={outputValue}
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
                {priceBToA ? parseFloat(priceBToA).toFixed(6) : '-'}
              </Text>
              <Text color={topIcons}>
                {currencies.CURRENCY_A?.symbol} per{' '}
                {currencies.CURRENCY_B?.symbol}{' '}
              </Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>
                {priceAToB ? parseFloat(priceAToB).toFixed(6) : '-'}
              </Text>
              <Text color={topIcons}>
                {currencies.CURRENCY_B?.symbol} per{' '}
                {currencies.CURRENCY_A?.symbol}
              </Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>0%</Text>
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
          display={inputValue && !hasTokenABeenApproved ? undefined : 'none'}
        >
          {`Approve ${currencies.CURRENCY_A?.symbol}`}
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
          display={outputValue && !hasTokenBBeenApproved ? undefined : 'none'}
        >
          {`Approve ${currencies.CURRENCY_B?.symbol}`}
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
          display={inputValue && outputValue ? 'none' : undefined}
        >
          Enter An Amount
        </Button>
        <Button
          size="lg"
          height="48px"
          width="200px"
          display={inputValue && outputValue ? undefined : 'none'}
          disabled={!hasTokenBBeenApproved || !hasTokenABeenApproved}
          border={
            inputValue &&
            outputValue &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? ''
              : '2px'
          }
          borderColor={
            inputValue &&
            outputValue &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? ''
              : genBorder
          }
          bgColor={
            inputValue &&
            outputValue &&
            hasTokenABeenApproved &&
            hasTokenBBeenApproved
              ? approveButtonBgColor
              : ''
          }
          color={
            inputValue &&
            outputValue &&
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
