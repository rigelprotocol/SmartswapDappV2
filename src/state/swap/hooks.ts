import { AppDispatch, RootState } from '../index';
import { provider } from '../../utils/utilsFunctions';
import { useCallback, useEffect, useState } from 'react';
import { Field, selectCurrency, typeInput, replaceSwapState, switchCurrencies } from './actions';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import { ParsedQs } from 'qs';
import { useCurrency } from '../../hooks/Tokens';
import { useDispatch, useSelector } from 'react-redux';
import { Currency } from '@uniswap/sdk-core';
import { useNativeBalance } from '../../utils/hooks/useBalances';
import { getERC20Token } from '../../utils/utilsFunctions';
import { isAddress } from '../../utils';
import { ethers } from 'ethers';
import { SupportedChainSymbols } from '../../utils/constants/chains';
import { useSwap } from '../../hooks/useSwap';
import { ZERO_ADDRESS } from '../../constants';
import { parseUnits } from '@ethersproject/units';
import useParsedQueryString from '../../hooks/useParsedQueryString';
import JSBI from 'jsbi';

export function tryParseAmount<T extends Currency>(
  value?: string,
  currency?: T
): string | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return typedValueParsed;
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

export function useSwapState(): RootState['swap'] {
  return useSelector<RootState, RootState['swap']>((state) => state.swap);
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onSwitchTokens: () => void
} {
  const { chainId, account } = useActiveWeb3React();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();

  const [Balance, Symbol] = useNativeBalance();


  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken
            ? currency.address
            : currency.isNative
            ? currency.symbol
            : '',
        })
      );
    },
    [dispatch]
  );


  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])


  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );
  return {
    onCurrencySelection,
    onUserInput,
    onSwitchTokens
  };
}

export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency };
  getMaxValue: any;
  bestTrade: string | undefined;
  inputError?: string;
  parsedAmount: string | undefined;
  showWrap: boolean;
  pathArray: [];
  pathSymbol: string;
} {
  const { account } = useActiveWeb3React();
  const [Balance] = useNativeBalance();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();
  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);

  const isExactIn: boolean = independentField === Field.INPUT;

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const [address, wrap, amount, pathArray, pathSymbol] = useSwap(
    isExactIn ? inputCurrency : outputCurrency,
    isExactIn ? outputCurrency : inputCurrency,
    parsedAmount
  );

  const showWrap = wrap;

  const bestTrade = amount;
  console.log(pathArray);

  const getMaxValue = async (currency: Currency) => {
    if (currency.isNative) {
      // return Balance === "0.0000" ? "0" :  Balance
      const Provider = await provider();
      const balance = await Provider?.getBalance(account as string);
      return balance ? JSBI.BigInt(balance.toString()) : undefined;
    } else if (isAddress(currency.address)) {
      const token = await getERC20Token(
        currency.address ? currency.address : ''
      );
      const balance = await token.balanceOf(account);
      const amount = ethers.utils.formatEther(balance);
      return amount === '0.0' ? '0' : parseFloat(amount).toFixed(4);
    }
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = 'Connect Wallet';
  }

  if ((inputCurrency && outputCurrency && !typedValue) || (inputCurrency && outputCurrency && typedValue == 0)){
    inputError = 'Enter an amount';
  }

  if (!inputCurrency || !outputCurrency || !address) {
    inputError = inputError ?? 'Select a Token';
  }

  if (parseFloat(typedValue) > 0 && pathArray?.length === 0 && !wrap) {
    inputError = 'Insufficient Liquidity for this Trade.';
  }

  return {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    inputError,
    showWrap,
    pathArray,
    pathSymbol,
  };
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam))
    ? urlParam
    : '';
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output'
    ? Field.OUTPUT
    : Field.INPUT;
}

const ENS_NAME_REGEX =
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

function parseCurrencyFromURLParameter(urlParam: any, symbol = ''): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam);
    if (valid) return valid;
    if (valid === false) return symbol;
  }
  return urlParam ?? '';
}
function queryParametersToSwapState(parsedQs: any, chainId: number) {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
  const symbol = SupportedChainSymbols[chainId ?? 56];
  if (inputCurrency === '' && outputCurrency === '') {
    inputCurrency = symbol;
    outputCurrency = '';
  } else if (inputCurrency === '') {
    inputCurrency = outputCurrency === symbol ? '' : symbol;
  } else if (outputCurrency === '' || inputCurrency === outputCurrency) {
    outputCurrency = inputCurrency === symbol ? '' : symbol;
  }
  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
  const { chainId, account } = useActiveWeb3React();
  const [, Symbol] = useNativeBalance();
  const dispatch = useDispatch<AppDispatch>();
  const parsedQs = useParsedQueryString();
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined;
        outputCurrencyId: string | undefined;
      }
    | undefined
  >();

  useEffect(() => {
    if (!chainId) return;
    const parsed = queryParametersToSwapState(parsedQs, chainId);
    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      })
    );
    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    });
  }, [dispatch, chainId, account]);
  return result;
}
