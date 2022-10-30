import { createReducer } from "@reduxjs/toolkit";
import {
    updateFarms,
    updateLoadingState,
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
        LPLocked: number;
    }>
        | undefined;
    loading: boolean;
    chainId: number | undefined;
}

const initialState: farmDataInterface = {
    loading: false,
    contents: undefined,
    chainId: undefined,
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

        .addCase(updateChainId, (state, action) => {
            const chainId = action.payload.value;

            return {
                ...state,
                chainId: chainId,
            };
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
