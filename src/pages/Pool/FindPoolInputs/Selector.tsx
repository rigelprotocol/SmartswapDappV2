import React from 'react';
import {
  Box,
  Flex,
  Spacer,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Currency } from '@uniswap/sdk-core';
import SelectToken from '../../../components/Tokens/SelectToken';
import CurrencyLogo from '../../../components/currencyLogo';

type SelectorProps = {
  onCurrencySelect: (currency: Currency | null | undefined) => void;
  currency?: Currency | null;
  otherCurrency?: Currency | null;
  tokenModal: boolean;
  setToken: React.Dispatch<React.SetStateAction<boolean>>;
};

const Selector = ({
  onCurrencySelect,
  currency,
  tokenModal,
  otherCurrency,
  setToken,
}: SelectorProps) => {
  const tokenListTriggerColor = useColorModeValue('#333333', '#F1F5F8');
  const activeButtonColor = useColorModeValue('#319EF6', '#4CAFFF');
  const genBorder = useColorModeValue('#DEE6ED', '#324D68');
  return (
    <>
      <Box
        borderRadius="md"
        border="1px solid #DEE6ED"
        pt={2}
        pb={2}
        borderColor={genBorder}
        onClick={() => setToken(tokenModal)}
        _hover={{
          border: `1px solid ${activeButtonColor}`,
          color: `${activeButtonColor}`,
          background: `$buttonBgColorTwo`,
        }}
        cursor="pointer"
      >
        <Flex my={2} alignItems="center">
          <Flex ml={2}>
            <CurrencyLogo
              currency={currency ?? undefined}
              size={24}
              squared={true}
            />
          </Flex>
          <Box ml={3} size="md" fontWeight="bold" color={tokenListTriggerColor}>
            {(currency && currency.symbol && currency.symbol.length > 20
              ? currency.symbol.slice(0, 4) +
                '...' +
                currency.symbol.slice(
                  currency.symbol.length - 5,
                  currency.symbol.length
                )
              : currency?.symbol) || <Text>Select a token</Text>}
          </Box>

          <Spacer />
          <ChevronDownIcon w={8} h={8} mr={3} />
        </Flex>
      </Box>
      <SelectToken
        onCurrencySelect={onCurrencySelect}
        tokenModal={tokenModal}
        setTokenModal={setToken}
        selectedCurrency={currency}
        otherSelectedCurrency={otherCurrency}
      />
    </>
  );
};

export default Selector;
