import { createReducer } from "@reduxjs/toolkit";
import {
  INITIAL_ALLOWED_SLIPPAGE,
  INITIAL_GASPRICE_INCREASE,
} from "../../utils/constants";
import {
  updateUserSlippageTolerance,
  SerializedToken,
  addSerializedToken,
  removeSerializedToken,
  updateUserDeadline,
} from "./actions";
import { updateVersion } from "../global/actions";

const currentTimestamp = () => new Date().getTime();

const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number;

  // deadline set by user in minutes, used in all txns
  userDeadline: number;

  timestamp: number;
  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken;
    };
  };
  removeTab: boolean;
}

export const initialState: UserState = {
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  timestamp: currentTimestamp(),
  tokens: {},
  removeTab: false,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== "number") {
        // state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE;
        state.userSlippageTolerance = 0;
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== "number") {
        // state.userDeadline = DEFAULT_DEADLINE_FROM_NOW;
        state.userDeadline = 0;
      }

      state.lastUpdateVersionTimestamp = currentTimestamp();
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline;
      state.timestamp = currentTimestamp();
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {};
      }
      state.tokens[serializedToken.chainId] =
        state.tokens[serializedToken.chainId] || {};
      state.tokens[serializedToken.chainId][serializedToken.address] =
        serializedToken;
      state.timestamp = currentTimestamp();
    })
    .addCase(
      removeSerializedToken,
      (state, { payload: { address, chainId } }) => {
        if (!state.tokens) {
          state.tokens = {};
        }
        console.log(state.tokens, address, chainId);
        state.tokens[chainId] = state.tokens[chainId] || {};
        delete state.tokens[chainId][address];
        state.timestamp = currentTimestamp();
      }
    )
);
