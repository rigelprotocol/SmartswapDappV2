import { createReducer } from "@reduxjs/toolkit";
import { stat } from "fs";
import farm from "../farm";
import {
  updateAllowance,
  updateFarms,
  updateLoadingState,
  updateSpecialPool,
  updateChainId,
} from "./actions";

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
  chainId: number;
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
  chainId: 56,
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

    .addCase(updateChainId, (state, action) => {
      const chainId = action.payload.value;

      return {
        ...state,
        chainId: chainId,
      };
    })

    // .addCase(updateSpecialPool, (state, action) => {
    //   const farms = action.payload.value;
    //   if (farms !== undefined) {
    //     return {
    //       ...state,
    //       specialPool: farms,
    //       loading: false,
    //     };
    //   }
    // })

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
