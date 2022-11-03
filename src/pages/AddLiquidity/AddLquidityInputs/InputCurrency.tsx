import React, { useCallback, useState, useEffect } from 'react';
import { Field } from '../../../state/mint/actions';
import { RouteComponentProps } from 'react-router-dom';
import InputSelector from '../../Swap/components/sendToken/InputSelector';
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import { GetAddressTokenBalance } from '../../../state/wallet/hooks';
import { useWeb3React } from '@web3-react/core';
import {
  useMintActionHandlers,
  useDerivedMintInfo,
  useMintState,
} from '../../../state/mint/hooks';
import { maxAmountSpend } from '../../../utils/maxAmountSpend';
import { GetAmountsOut } from '../../../utils/getAmountsOut';
import { SmartSwapRouter } from '../../../utils/Contracts';
import { SMARTSWAPROUTER } from '../../../utils/addresses';
import { getAddress } from '../../../utils/hooks/usePools';
import { ethers } from 'ethers';

interface InputCurrencyProps {
  onUserInput: (value: string) => void;
  onCurrencySelection: Function;
  currency: Currency | undefined;
  otherCurrency: Currency | undefined;
  onMax: () => void;
  value: string;
  setBalanceA: React.Dispatch<React.SetStateAction<string>>;
}

const InputCurrency = ({
  onUserInput,
  onCurrencySelection,
  currency,
  otherCurrency,
  onMax,
  value,
  setBalanceA,
}: InputCurrencyProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const [balance] = GetAddressTokenBalance(currency ?? undefined);
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
  );

  useEffect(() => {
    setBalanceA(balance as string);
  }, [currency, balance, setBalanceA]);
  return (
    <InputSelector
      onUserInput={onUserInput}
      onCurrencySelect={handleInputSelect}
      currency={currency}
      otherCurrency={otherCurrency}
      tokenModal={tokenModal}
      onMax={onMax}
      setToken={() => setTokenModal((state) => !state)}
      value={value}
      max
    />
  );
};

export default React.memo(InputCurrency);

// const InputCurrency = ({
//   pairAvailable,
//   setInputValue,
//   setOutputValue,
//   inputValue,
// }: InputCurrencyProps) => {
//   const { chainId, library, account } = useWeb3React();

//   const [tokenModal, setTokenModal] = useState(false);
//   const { currencies, getMaxValue } = useDerivedMintInfo();
//   const { onCurrencySelection, onUserInput } = useMintActionHandlers();

//   const { independentField, typedValue } = useMintState();
//   const dependentField =
//     independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

//   const getAmount = useCallback(
//     async (value: string, address: string) => {
//       if (Field.CURRENCY_A && Field.CURRENCY_B && value && address) {
//         if (pairAvailable) {
//           try {
//             const smartswapRouter = await SmartSwapRouter(address);

//             const currencyAAddress = getAddress(currencies.CURRENCY_A);
//             const currencyBAddress = getAddress(currencies.CURRENCY_B);

//             const formattedValue = value && ethers.utils.parseEther(value);
//             console.log(formattedValue);

//             const amountOut = await smartswapRouter.getAmountsOut(
//               formattedValue?.toString(),
//               [currencyAAddress, currencyBAddress]
//             );

//             const AmountB =
//               amountOut &&
//               ethers.utils.formatEther(amountOut.toString().split(',')[1]);
//             onUserInput(Field.CURRENCY_B, AmountB);
//             setInputValue(value);
//             setOutputValue(AmountB);
//           } catch (e) {
//             console.log(e);
//           }
//         } else {
//           setInputValue(value);
//         }
//       } else if (value === '') {
//         onUserInput(Field.CURRENCY_B, '');
//         setInputValue('');
//         setOutputValue('');
//       }
//     },
//     [
//       onUserInput,
//       chainId,
//       currencies.CURRENCY_A,
//       currencies.CURRENCY_B,
//       pairAvailable,
//     ]
//   );

//   const handleTypeInput = useCallback(
//     (value: string) => {
//       onUserInput(Field.CURRENCY_A, value);
//       console.log(SMARTSWAPROUTER[chainId as number]);
//       getAmount(value, SMARTSWAPROUTER[chainId as number]);
//     },
//     [onUserInput, chainId, getAmount]
//   );

//   console.log(SMARTSWAPROUTER[chainId as number]);
//   const formattedAmounts = {
//     [independentField]: typedValue,
//   };

//   const handleInputSelect = useCallback(
//     (inputCurrency) => {
//       onCurrencySelection(Field.CURRENCY_A, inputCurrency);
//       setTokenModal((state) => !state);
//     },
//     [onCurrencySelection]
//   );
//   const handleMaxInput = async () => {
//     const value = await getMaxValue(currencies[Field.CURRENCY_A]);
//     const maxAmountInput = maxAmountSpend(value, currencies[Field.CURRENCY_B]);
//     if (maxAmountInput) {
//       onUserInput(Field.CURRENCY_A, maxAmountInput);
//     }
//   };
//   return (
//     <InputSelector
//       onUserInput={handleTypeInput}
//       onCurrencySelect={handleInputSelect}
//       currency={currencies[Field.CURRENCY_A]}
//       otherCurrency={currencies[Field.CURRENCY_B]}
//       tokenModal={tokenModal}
//       onMax={handleMaxInput}
//       setToken={() => setTokenModal((state) => !state)}
//       value={formattedAmounts[Field.CURRENCY_A]}
//       max
//     />
//   );
// };

// export default InputCurrency;
