import { createReducer } from "@reduxjs/toolkit";
import { updateFarms, updateLoadingState, updateSpecialPool } from "./actions";

export interface farmDataInterface {
  contents:
    | Array<{
        id: number;
        img: string;
        deposit: string;
        earn: string;
        type: string;
        totalLiquidity: number;
        APY: number;
        tokenStaked: string[];
        RGPEarned: string;
        availableToken: string;
        allowance: string;
        address: string;
      }>
    | undefined;
  loading: boolean;
  specialPool:
    | Array<{
        id: number;
        img: string;
        deposit: string;
        earn: string;
        type: string;
        totalLiquidity: number;
        APY: number;
        tokenStaked: string[];
        RGPEarned: string;
        availableToken: string;
        allowance: string;
        address: string;
      }>
    | undefined;
}

const initialState: farmDataInterface = {
  loading: false,
  contents: undefined,
  specialPool: undefined,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateFarms, (state, action) => {
      const farms = action.payload.value;
      if (farms !== undefined) {
        return {
          ...state,
          contents: farms,
          loading: false,
        };
      }
    })

    .addCase(updateSpecialPool, (state, action) => {
      const farms = action.payload.value;
      if (farms !== undefined) {
        return {
          ...state,
          specialPool: farms,
          loading: false,
        };
      }
    })

    .addCase(updateLoadingState, (state, action) => {
      if (state.contents !== undefined) {
        return {
          ...state,
          loading: false,
        };
      } else {
        return {
          ...state,
          loading: action.payload.value,
        };
      }
    })
);
