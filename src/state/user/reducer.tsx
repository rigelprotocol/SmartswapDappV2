import { createReducer } from '@reduxjs/toolkit'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../utils/constants'
import {
  updateUserSlippageTolerance,
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  timestamp: number
}

export const initialState: UserState = {
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  timestamp: currentTimestamp(),
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
)
