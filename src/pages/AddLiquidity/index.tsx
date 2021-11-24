import React, { useCallback, useState } from 'react';
import { Field } from '../../state/mint/actions'

import { RouteComponentProps } from 'react-router-dom'
import InputSelector from '../Swap/components/sendToken/InputSelector';
import { SettingsIcon } from '../../theme/components/Icons';
import TransactionSettings from '../../components/TransactionSettings';
import { Currency, CurrencyAmount, } from '@uniswap/sdk-core'
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
import { useHistory } from 'react-router';

import { useMintActionHandlers, useDerivedMintInfo, useMintState } from '../../state/mint/hooks';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { useWeb3React } from '@web3-react/core';
import { currencyId } from '../../utils/currencyId';

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

  const { chainId, library, account } = useWeb3React();
  const [tokenModal, setTokenModal] = useState(false);
  const { currencies, getMaxValue } = useDerivedMintInfo()
  const { onCurrencySelection, onUserInput } = useMintActionHandlers()
  const { independentField, typedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A


  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.CURRENCY_A, inputCurrency)
      setTokenModal((state) => !state)
    },
    [onCurrencySelection],
  )



  const handleMaxInput = async () => {
    const value = await getMaxValue(currencies[Field.CURRENCY_A])
    const maxAmountInput = maxAmountSpend(value, currencies[Field.CURRENCY_B])
    if (maxAmountInput) {
      onUserInput(Field.CURRENCY_A, maxAmountInput)
    }
  }

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.CURRENCY_A, value)
    },
    [onUserInput],
  )

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    // [dependentField]: showWrap
    //   ? parsedAmounts[independentField]?.toExact() ?? ''
    //   : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    [dependentField]: '67'
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew =
          currencyIdNew === 'ETH' || (chainId !== undefined && currencyIdNew === WETH9_EXTENDED[chainId]?.address)
        const isETHOrWETHOther =
          currencyIdOther !== undefined &&
          (currencyIdOther === 'ETH' || (chainId !== undefined && currencyIdOther === WETH9_EXTENDED[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId]
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        history.push(`/add/${idA}`)
      } else {
        history.push(`/add/${idA}/${idB}`)
      }
    },
    [handleCurrencySelect, currencyIdB, history]
  )

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
          <InputSelector
            onUserInput={handleTypeInput}
            onCurrencySelect={handleInputSelect}
            currency={currencies[Field.CURRENCY_A]}
            otherCurrency={currencies[Field.CURRENCY_B]}
            tokenModal={tokenModal}
            onMax={handleMaxInput}
            setToken={() => setTokenModal((state) => !state)}
            value={formattedAmounts[Field.CURRENCY_A]}
            max
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
          <InputSelector max={false} />
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
              <Text color={textColorOne}>11.5068</Text>
              <Text color={topIcons}>BNB per RGP</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Text color={textColorOne}>0.08445554</Text>
              <Text color={topIcons}>RGP per BNB</Text>
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
          border="2px"
          borderColor={genBorder}
          color={btnTextColor}
          w="100%"
        >
          Enter An Amount
        </Button>
      </Box>
    </Center>
  );
};
