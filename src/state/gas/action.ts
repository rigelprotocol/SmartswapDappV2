import { createAction } from "@reduxjs/toolkit";

export const updateUserGasPrice = createAction<{
  userGasPrice: number;
}>("gas/updateUserGasPrice");

export const setDefaultGasPrice = createAction<{
  userGasPrice: number;
}>("gas/setDefaultGasPrice");
