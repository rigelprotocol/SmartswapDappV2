import { createReducer } from "@reduxjs/toolkit";
import {setChainId} from "./actions";

export interface ChainID {
    chainId: number;
}

const initialState: ChainID = {
    chainId: 56,
};

export default createReducer(initialState, (builder) =>
    builder
        .addCase(setChainId, (state, action) => {
            const chainId = action.payload.value;

            return {
                ...state,
                chainId: chainId,
            };
        })
);
