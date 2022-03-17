import { createAction } from "@reduxjs/toolkit";

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
}

export const updateUserSlippageTolerance = createAction<{
  userSlippageTolerance: number;
}>("user/updateUserSlippageTolerance");

export const addSerializedToken = createAction<{
  serializedToken: SerializedToken;
}>("user/addSerializedToken");

export const removeSerializedToken = createAction<{
  chainId: number;
  address: string;
}>("user/removeSerializedToken");

export const updateUserDeadline = createAction<{ userDeadline: number }>(
  "user/updateUserDeadline"
);
