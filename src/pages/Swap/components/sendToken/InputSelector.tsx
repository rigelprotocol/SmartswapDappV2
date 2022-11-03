import React, { useCallback, useState } from "react";
import {
  Flex,
  Input,
  Text,
  Menu,
  Button,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { GetAddressTokenBalance } from "../../../../state/wallet/hooks";
import SelectToken from "../../../../components/Tokens/SelectToken";
import { Currency } from "@uniswap/sdk-core";
import CurrencyLogo from "../../../../components/currencyLogo";
import { escapeRegExp } from "../../../../utils";
import { useUpdateBalance } from "../../../../utils/hooks/useUpdateBalances";

type InputSelectorProps = {
  max: Boolean;
  onCurrencySelect: (currency: Currency | null | undefined) => void;
  currency?: Currency | null;
  otherCurrency?: Currency | null;
  tokenModal: boolean;
  setToken: React.Dispatch<React.SetStateAction<boolean>>;
  onMax?: () => void;
  onUserInput: (value: string) => void;
  value: string | undefined;
  display?:boolean;
  onHover?:()=>void
  disable?:boolean
  placeholder?:string
};

const InputSelector = ({
  max,
  onCurrencySelect,
  currency,
  tokenModal,
  otherCurrency,
  setToken,
  onMax,
  onUserInput,
  value,
  display,
  disable,
  onHover
}: InputSelectorProps) => {
  const inputColor = useColorModeValue("#333333", "#F1F5F8");
  const balanceColor = useColorModeValue("#666666", "#DCE5EF");
  const maxColor = useColorModeValue("#319ef6", "#4CAFFF");
  const maxBgColor = useColorModeValue("#EBF6FE", "#EAF6FF");
  const tokenListTriggerColor = useColorModeValue("", "#DCE5EF");
  const tokenListTrgiggerBgColor = useColorModeValue("", "#213345");

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  const [balance] = GetAddressTokenBalance(currency ?? undefined);
 
  return (
    <>
      <Flex alignItems='center' mt={3} justifyContent='space-between'>
       {!display && <Input
          fontSize='2xl'
          type='text'
          min='0'
          border='none'
          color={inputColor}
          isRequired
          placeholder='0.0'
          value={value}
          disabled={disable}
          title={disable ? "please fill the input box below, they control this input": undefined}
          onChange={(event) => {
             !disable && enforcer(event.target.value.replace(/,/g, "."));
          }}
          focusBorderColor='none'
          onMouseEnter={disable ? onHover : undefined}
          onMouseLeave={disable ? onHover : undefined}
        />

       } 
        <Flex>
          <Menu>
            <Button
              border='0px'
              h='40px'
              rightIcon={<ChevronDownIcon />}
              mr={display ? "0" : 3}
              bgColor={tokenListTrgiggerBgColor}
              onClick={() => setToken(tokenModal)}
              data-tut='reactour__selectToken'
            >
              <Box mr='3'>
                <CurrencyLogo
                  currency={currency ?? undefined}
                  size={24}
                  squared={true}
                />
              </Box>

              {(currency && currency.symbol && currency.symbol.length > 20
                ? currency.symbol.slice(0, 4) +
                  "..." +
                  currency.symbol.slice(
                    currency.symbol.length - 5,
                    currency.symbol.length
                  )
                : currency?.symbol) || (
                <Text color={tokenListTriggerColor}>Select a token</Text>
              )}
            </Button>
          </Menu>
        </Flex>
      </Flex>
      <Flex mt={3} alignItems='center'>
       {!display && <Text ml={4} color={balanceColor} fontSize='14px'>
          Balance:{" "}
          {balance.currency?.isToken ? balance.toSignificant(6) : balance}{" "}
          {currency?.symbol}
        </Text>}
        {max ? (
          <Text
            ml={2}
            color={maxColor}
            h='22px'
            w='34px'
            px='4px'
            borderRadius='4px'
            bgColor={maxBgColor}
            fontSize='14px'
            onClick={onMax}
            cursor='pointer'
          >
            Max
          </Text>
        ) : (
          <></>
        )}
      </Flex>
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

export default React.memo(InputSelector);
