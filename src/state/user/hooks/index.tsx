import { useCallback,useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, useAppSelector } from '../../index'
import {
  updateUserSlippageTolerance,
  updateUserDeadline,
} from '../actions'
import { Token } from '@uniswap/sdk-core'
import { useActiveWeb3React } from '../../../utils/hooks/useActiveWeb3React'
import { SerializedToken, addSerializedToken,removeSerializedToken } from '../actions'

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>();
  const userSlippageTolerance = useSelector<RootState, RootState['user']['userSlippageTolerance']>((state) => {
    return state.user.userSlippageTolerance
  });

  const setUserSlippageTolerance = useCallback(
    (slippage: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }))
    },
    [dispatch],
  );

  return [userSlippageTolerance, setUserSlippageTolerance]
}

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}


export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}


export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React();
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens);

  return useMemo(() => {
    if (!chainId) return [];
    return Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch],
  )
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>();
  const userDeadline = useSelector<RootState, RootState['user']['userDeadline']>((state) => {
    return state.user.userDeadline
  });

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }))
    },
    [dispatch],
  );

  return [userDeadline, setUserDeadline]
}
