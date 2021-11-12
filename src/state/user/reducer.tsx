import { createReducer } from '@reduxjs/toolkit'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../utils/constants'
import {
  updateUserSlippageTolerance,
} from './actions'
import { updateVersion } from '../global/actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  
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
    .addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }
      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
)
