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
import { ethers } from 'ethers';
import { SmartSwapRouter } from '../../../utils/Contracts';
import { SMARTSWAPROUTER } from '../../../utils/addresses';
import { getAddress } from '../../../utils/hooks/usePools';

interface OutputCurrencyProps {
  onUserOutput: (value: string) => void;
  onCurrencySelection: Function;
  currency: Currency | undefined;
  otherCurrency: Currency | undefined;
  value: string;
  setBalanceB: React.Dispatch<React.SetStateAction<string>>;
}

const OutputCurrecy = ({
  onCurrencySelection,
  currency,
  otherCurrency,
  onUserOutput,
  value,
  setBalanceB,
}: OutputCurrencyProps) => {
  const [tokenModal, setTokenModal] = useState(false);
  const [balance] = GetAddressTokenBalance(currency ?? undefined);
  const handleInputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      setTokenModal((state) => !state);
    },
    [onCurrencySelection]
    // [],
  );

  useEffect(() => {
    setBalanceB(balance as string);
  }, [currency, balance, setBalanceB]);

  return (
    <InputSelector
      onCurrencySelect={handleInputSelect}
      currency={currency}
      otherCurrency={otherCurrency}
      tokenModal={tokenModal}
      setToken={() => setTokenModal((state) => !state)}
      onUserInput={onUserOutput}
      value={value}
      max={false}
    />
  );
};

export default React.memo(OutputCurrecy);

// interface OutputCurrecyProps {
//   pairAvailable: boolean;
//   setInputValue: React.Dispatch<React.SetStateAction<string>>;
//   setOutputValue: React.Dispatch<React.SetStateAction<string>>;
//   outputValue: string;
// }

// const OutputCurrecy = ({
//   pairAvailable,
//   setInputValue,
//   setOutputValue,
//   outputValue,
// }: OutputCurrecyProps) => {
//   const { chainId, library, account } = useWeb3React();
//   const [update, setUpdate] = useState(false);

//   const [tokenModal, setTokenModal] = useState(false);
//   const { currencies, getMaxValue } = useDerivedMintInfo();
//   const { onCurrencySelection, onUserInput } = useMintActionHandlers();
//   const { independentField, typedValue } = useMintState();

//   const dependentField: Field =
//     independentField === Field.CURRENCY_B ? Field.CURRENCY_A : Field.CURRENCY_B;

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
//               [currencyBAddress, currencyAAddress]
//             );

//             const AmountA =
//               amountOut &&
//               ethers.utils.formatEther(amountOut.toString().split(',')[1]);
//             onUserInput(Field.CURRENCY_A, AmountA);
//             setInputValue(AmountA);
//             setOutputValue(value);
//           } catch (e) {
//             console.log(e);
//           }
//         } else {
//           setOutputValue(value);
//         }
//       } else if (value === '') {
//         onUserInput(Field.CURRENCY_A, '');
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
//       update,
//       Field.CURRENCY_A,
//       Field.CURRENCY_B,
//     ]
//   );

//   const getAmountWhenSelected = useCallback(
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

//             const AmountA =
//               amountOut &&
//               ethers.utils.formatEther(amountOut.toString().split(',')[1]);
//             onUserInput(Field.CURRENCY_B, AmountA);
//             setInputValue(value);
//             setOutputValue(AmountA);
//           } catch (e) {
//             console.log(e);
//           }
//         } else {
//           setOutputValue(value);
//           setInputValue(value);
//         }
//       } else if (value === '') {
//         onUserInput(Field.CURRENCY_A, '');
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
//       update,
//     ]
//   );

//   const handleTypeInput = useCallback(
//     (value: string) => {
//       onUserInput(Field.CURRENCY_B, value);
//       console.log(Field.CURRENCY_A);
//       console.log(Field.CURRENCY_B);
//       getAmount(value, SMARTSWAPROUTER[chainId as number]);
//     },
//     [onUserInput, chainId, getAmount, Field.CURRENCY_A, Field.CURRENCY_B]
//   );

//   const formattedAmounts = {
//     [independentField]: typedValue,
//     // [dependentField]: showWrap
//     //   ? parsedAmounts[independentField]?.toExact() ?? ''
//     //   : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
//     // [dependentField]: ''
//   };

//   const handleInputSelect = useCallback(
//     (outputCurrency) => {
//       onCurrencySelection(Field.CURRENCY_B, outputCurrency);
//       setTokenModal((state) => !state);

//       console.log('typed value', typedValue);

//       // getAmountWhenSelected(typedValue, SMARTSWAPROUTER[chainId as number]);
//     },
//     [onCurrencySelection]
//     // [],
//   );

//   console.log(formattedAmounts[Field.CURRENCY_B]);

//   return (
//     <InputSelector
//       onCurrencySelect={handleInputSelect}
//       currency={currencies[Field.CURRENCY_B]}
//       otherCurrency={currencies[Field.CURRENCY_A]}
//       tokenModal={tokenModal}
//       setToken={() => setTokenModal((state) => !state)}
//       onUserInput={handleTypeInput}
//       value={formattedAmounts[Field.CURRENCY_B]}
//       max={false}
//     />
//   );
// };

// export default OutputCurrecy;
