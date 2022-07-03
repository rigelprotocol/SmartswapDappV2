import {createReducer} from "@reduxjs/toolkit";
import {
    clearAllFarms,
    clearSearchResult,
    updateFilterResult,
    updateNewFilterResult,
    updateNewSearchResult,
    updateProductFarmDetails,
    updateSearchResult,
    updateYieldFarmDetails
} from "./action";

export interface FarmingSearchState {
    searchResult: [] | undefined;
    filterResult: [] | undefined;
    newFilterResult: [] | undefined;
    newSearchResult: [] | undefined;
    content:
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
    productFarm:
        | Array<{
        feature:string,
        percentageProfitShare:string,
        profitTimeLine:string,
        totalLiquidity:string,
        estimatedTotalProfit:string,
        deposit: string,
        pid:number,
        poolAllowance: string,
        type:string,
        tokenStaked:string
    }>
        | undefined;
}

const initialState: FarmingSearchState = {
    searchResult: undefined,
    newSearchResult: undefined,
    filterResult: undefined,
    newFilterResult: undefined,
    content: undefined,
    productFarm:undefined
};

export default createReducer(initialState, (builder) =>
    builder
        .addCase(updateSearchResult, (farming, { payload: { farmData } }) => {
            return {
                ...farming,
                searchResult: farmData,
            };
        })

        .addCase(updateNewSearchResult, (farming, { payload: { farmData } }) => {
            return {
                ...farming,
                newSearchResult: farmData,
            };
        })

        .addCase(clearAllFarms, (farming, { payload }) => {
            return {
                ...farming,
                newSearchResult: undefined,
                newFilterResult: undefined,
                content: undefined,
            };
        })

        .addCase(updateNewFilterResult, (farming, { payload: { farmData } }) => {
            return {
                ...farming,
                newFilterResult: farmData,
            };
        })

        .addCase(updateYieldFarmDetails, (farming, { payload: { value } }) => {
            // const farms = action.payload.farmData;
            if (value !== undefined) {
                return {
                    ...farming,
                    content: value,
                };
            }
        })
        .addCase(updateProductFarmDetails, (farming, { payload: { value } }) => {
            // const farms = action.payload.farmData;
            if (value !== undefined) {
                return {
                    ...farming,
                    productFarm: value,
                };
            }
        })

        .addCase(updateFilterResult, (farming, { payload: { farmData } }) => {
            return {
                ...farming,
                filterResult: farmData,
            };
        })
        .addCase(clearSearchResult, (farming, {}) => {
            return {
                ...farming,
                searchResult: undefined,
                filterResult: undefined,
            };
        })
);
