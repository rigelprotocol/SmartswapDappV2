
import { Currency, CurrencyAmount, Percent, Price, Token } from '@uniswap/sdk-core'

import JSBI from 'jsbi'
import { ReactNode, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../index'

import { Field, typeInput } from './actions'
import { useActiveWeb3React } from '../../utils/hooks/useActiveWeb3React'
import { AppDispatch } from '../index'
import { useNativeBalance } from '../../utils/hooks/useBalances'
import { useCurrency } from '../../hooks/Tokens'
import { provider } from '../../utils/utilsFunctions'
import { getERC20Token } from "../../utils/utilsFunctions";
import { isAddress } from '../../utils'
import { ethers } from 'ethers'
const ZERO = JSBI.BigInt(0)

export function useMintState(): RootState['mint'] {
    return useSelector<RootState, RootState['mint']>((state) => state.mint)
}



export function useMintActionHandlers(noLiquidity: boolean | undefined): {
    onFieldAInput: (typedValue: string) => void
    onFieldBInput: (typedValue: string) => void
} {
    const dispatch = useDispatch<AppDispatch>()

    const onFieldAInput = useCallback(
        (typedValue: string) => {
            dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }))
        },
        [dispatch, noLiquidity]
    )

    const onFieldBInput = useCallback(
        (typedValue: string) => {
            dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }))
        },
        [dispatch, noLiquidity]
    )

    return {
        onFieldAInput,
        onFieldBInput,
    }
}

export function useDerivedSwapInfo(): {
    currencies: { [field in Field]?: Currency },
    getMaxValue: any

} {
    const { account } = useActiveWeb3React();
    const [Balance] = useNativeBalance();
    const {
        independentField,
        typedValue,
        [Field.CURRENCY_A]: { currencyId: inputCurrencyId },
        [Field.CURRENCY_B]: { currencyId: outputCurrencyId },
        recipient,
    } = useMintState()
    const inputCurrency = useCurrency(inputCurrencyId)
    const outputCurrency = useCurrency(outputCurrencyId)

    const currencies: { [field in Field]?: Currency } = {
        [Field.CURRENCY_A]: inputCurrency ?? undefined,
        [Field.CURRENCY_B]: outputCurrency ?? undefined,
    }

    const getMaxValue = async (currency: Currency) => {
        if (currency.isNative) {
            // return Balance === "0.0000" ? "0" :  Balance
            const Provider = await provider();
            const balance = await Provider?.getBalance(account as string);
            return balance ? JSBI.BigInt(balance.toString()) : undefined

        } else if (isAddress(currency.address)) {
            const token = await getERC20Token(currency.address ? currency.address : "");
            const balance = await token.balanceOf(account);
            const amount = ethers.utils.formatEther(balance)
            return amount === "0.0" ? "0" : parseFloat(amount).toFixed(4)

        }
    }

    return {
        currencies,
        getMaxValue
    }
}


