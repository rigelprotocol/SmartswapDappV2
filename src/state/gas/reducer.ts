import { INITIAL_GAS, INITIAL_GASPRICE_INCREASE } from "../../utils/constants";
import { createReducer } from "@reduxjs/toolkit";
import { updateUserGasPrice, setDefaultGasPrice } from "./action";
import { useWeb3React } from "@web3-react/core";

export interface GasState {
  // percentage to increase gas price, used in all txns
  userGasPrice: number;
  changed: boolean;
}

const initialState: GasState = {
  userGasPrice: INITIAL_GAS,
  changed: false,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateUserGasPrice, (gas, { payload: { userGasPrice } }) => {
      return {
        ...gas,
        userGasPrice: userGasPrice,
        changed: true,
      };
    })
    .addCase(setDefaultGasPrice, (gas, { payload: { userGasPrice } }) => {
      return {
        ...gas,
        userGasPrice: userGasPrice,
      };
    })
);
