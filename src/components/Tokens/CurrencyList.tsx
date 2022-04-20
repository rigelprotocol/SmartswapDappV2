import React from "react";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import CurrencyLogo from "../currencyLogo";
import { useColorModeValue, Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { useCombinedActiveList } from "../../state/lists/hooks";
import { GetAddressTokenBalance } from "../../state/wallet/hooks";
import { isTokenOnList } from "../../utils/index";
import { useIsUserAddedToken } from "../../hooks/Tokens";
type ICurrencyList = {
  currency: Currency;
  onCurrencySelect: (currency: Currency) => void;
  selectedCurrency?: Currency | null;
  otherSelectedCurrency?: Currency | null;
};
const CurrencyList = ({
  currency,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
}: ICurrencyList) => {
  const { account } = useActiveWeb3React();
  const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
  const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
  const hover = useColorModeValue("rgba(228, 225, 222, 0.74)", "#14181b6c");

  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(
    selectedTokenList,
    currency.isToken ? currency : undefined
  );
  const customAdded = useIsUserAddedToken(currency);

  const [balance] = GetAddressTokenBalance(currency);
  const selected = (
    selectedCurrency: Currency | null | undefined,
    currency: Currency
  ) => {
    if (selectedCurrency && currency && currency.isNative) {
      return selectedCurrency.symbol === currency.symbol &&
        selectedCurrency.chainId === currency.chainId
        ? true
        : false;
    } else if (selectedCurrency && currency && !currency.isNative) {
      return selectedCurrency.address === currency.address &&
        selectedCurrency.chainId === currency.chainId
        ? true
        : false;
    }
  };
  const isSelected = selected(selectedCurrency, currency);
  const otherSelected = selected(otherSelectedCurrency, currency);
  const handleSelect = () => onCurrencySelect(currency);

  function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
    return <Text>{balance.currency?.isToken ? balance : balance}</Text>;
  }

  return (
    <Flex
      justifyContent='space-between'
      py='2'
      fontSize='16px'
      cursor={isSelected ? "" : "pointer"}
      onClick={() => (isSelected ? null : handleSelect())}
      opacity={isSelected || otherSelected ? "0.6" : "1"}
      _hover={{ background: `${isSelected ? "" : hover}` }}
      px='4'
      borderRadius='10px'
    >
      <Flex>
        <Box mr={3} mt={3}>
          <CurrencyLogo currency={currency} size={24} squared={true} />
        </Box>

        <Box>
          <Text color={heavyTextColor} fontWeight='700' mt='2'>
            {currency.symbol}
          </Text>

          {!currency.isNative && !isOnSelectedList && customAdded ? (
            <Text>{currency.name} • Added by user</Text>
          ) : (
            <Text color={lightTextColor}>{currency.name} </Text>
          )}
          {/* { currency?.isImported ? " • Added by user" : ""} */}
        </Box>
      </Flex>
      <Box mt='3'>
        {balance ? (
          <Balance balance={balance} />
        ) : account ? (
          <Spinner size='xs' />
        ) : null}
      </Box>
    </Flex>
  );
};

export default CurrencyList;
