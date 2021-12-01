import React, { useCallback, useState } from 'react';
import { Field } from '../../../state/mint/actions'
import { RouteComponentProps } from 'react-router-dom'
import InputSelector from '../../Swap/components/sendToken/InputSelector';
import { Currency, CurrencyAmount, } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core';
import { useMintActionHandlers, useDerivedMintInfo, useMintState } from '../../../state/mint/hooks';
import { maxAmountSpend } from '../../../utils/maxAmountSpend';

const InputCurrency = () => {

    const { chainId, library, account } = useWeb3React()

    const [tokenModal, setTokenModal] = useState(false);
    const { currencies, getMaxValue } = useDerivedMintInfo()
    const { onCurrencySelection, onUserInput } = useMintActionHandlers()


    const { independentField, typedValue } = useMintState()
    const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A


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
    return (
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
    )
}

export default InputCurrency
