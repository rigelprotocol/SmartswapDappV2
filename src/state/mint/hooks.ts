import {Currency} from '@uniswap/sdk-core';

import JSBI from 'jsbi';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../index';

import { Field, selectCurrency, typeInput } from './actions';
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React';
import { AppDispatch } from '../index';
import { useNativeBalance } from '../../utils/hooks/useBalances';
import { useCurrency } from '../../hooks/Tokens';
import { getERC20Token } from '../../utils/utilsFunctions';
import { isAddress, ParseFloat } from '../../utils';
import { ethers } from 'ethers';
import { parseUnits } from '@ethersproject/units';
// import {useMint}
import { useMint } from '../../hooks/useMint';
import { ZERO_ADDRESS } from '../../constants';
import {Web3Provider} from "@ethersproject/providers";
const ZERO = JSBI.BigInt(0);

export function useMintState(): RootState['mint'] {
  return useSelector<RootState, RootState['mint']>((state) => state.mint);
}

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

export function useMintActionHandlers(): {
  onCurrencyFor: (currencyAddress: string,field: Field, ) => void;
   onCurrencySelection: (field: Field, currency: Currency) => void;
  onUserInput: (field: Field, typedValue: string, no: boolean) => void;
} {
  const { chainId, account, library } = useActiveWeb3React();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useMintState();

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


  const onCurrencyFor = useCallback(
    ( currencyAddress: string,field: Field,) => {
      dispatch(
        selectCurrency( {field: field,
          currencyId: currencyAddress})
      );
    },
    [dispatch]
  );

  const onUserInput = useCallback(
    (field: Field, typedValue: string, no: boolean) => {
      dispatch(typeInput({ field, typedValue, no }));
    },
    [dispatch]
  );
  return {
    onCurrencySelection,
    onUserInput,
    onCurrencyFor
    };
}

export function useDerivedMintInfo(): {
  currencies: { [field in Field]?: Currency };
  getMaxValue: any;
  bestTrade: string | undefined;
  inputError?: string;
  parsedAmount: string | undefined;
  showWrap: boolean;
  address: string;
} {
  const { account } = useActiveWeb3React();
  const [Balance] = useNativeBalance();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useMintState();

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

  const [address, wrap, amount] = useMint(
    isExactIn ? inputCurrency : outputCurrency,
    isExactIn ? outputCurrency : inputCurrency,
    parsedAmount
  );

  const bestTrade = amount;

  const showWrap = wrap;

  const getMaxValue = async (currency: Currency, library: Web3Provider) => {
    if (currency.isNative) {
      // return Balance === "0.0000" ? "0" :  Balance
      const balance = await library?.getBalance(account as string);
      return balance ? JSBI.BigInt(balance.toString()) : undefined;
    } else if (isAddress(currency.address)) {
      const token = await getERC20Token(
        currency.address ? currency.address : '', library
      );
      const [balance, decimals] = await Promise.all([token.balanceOf(account), token.decimals()]);
      const amount = ParseFloat(ethers.utils.formatUnits(balance.toString(), decimals),4);
      console.log({amount})
      return amount === '0.0' ? '0' :  amount;
    }
  };

  return {
    currencies,
    getMaxValue,
    bestTrade,
    parsedAmount,
    showWrap,
    address
  };
}
