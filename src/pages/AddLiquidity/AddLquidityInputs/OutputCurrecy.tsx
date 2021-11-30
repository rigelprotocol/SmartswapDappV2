import React, { useCallback, useState } from 'react';
import { Field } from '../../../state/mint/actions'
import { RouteComponentProps } from 'react-router-dom'
import InputSelector from '../../Swap/components/sendToken/InputSelector';
import { Currency, CurrencyAmount, } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core';
import { useMintActionHandlers, useDerivedMintInfo, useMintState } from '../../../state/mint/hooks';
import { maxAmountSpend } from '../../../utils/maxAmountSpend';


const OutputCurrecy = () => {

    const { chainId, library, account } = useWeb3React()

    const [tokenModal, setTokenModal] = useState(false);
    const { currencies, getMaxValue } = useDerivedMintInfo()
    const { onCurrencySelection, onUserInput } = useMintActionHandlers()
    const { independentField, typedValue } = useMintState()


    const dependentField: Field = independentField === Field.CURRENCY_B ? Field.CURRENCY_A : Field.CURRENCY_B


    const handleInputSelect = useCallback(
        (outputCurrency) => {

            onCurrencySelection(Field.CURRENCY_B, outputCurrency)
            setTokenModal((state) => !state)
        },
        [onCurrencySelection],
        // [],
    )

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.CURRENCY_B, value)
        },
        [onUserInput],
    )

    const formattedAmounts = {
        [independentField]: typedValue,
        // [dependentField]: showWrap
        //   ? parsedAmounts[independentField]?.toExact() ?? ''
        //   : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
        [dependentField]: ''
    }



    return (
        <InputSelector
            onCurrencySelect={handleInputSelect}
            currency={currencies[Field.CURRENCY_B]}
            otherCurrency={currencies[Field.CURRENCY_A]}
            tokenModal={tokenModal}
            setToken={() => setTokenModal((state) => !state)}
            onUserInput={handleTypeInput}
            value={formattedAmounts[Field.CURRENCY_B]}
            max={false} />
    )
}

export default OutputCurrecy
