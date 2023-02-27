import {createReducer} from "@reduxjs/toolkit";
import {
    clearAllFarms,
    clearSearchResult,
    updateFilterResult,
    updateNewFilterResult,
    updateNewSearchResult,
    updateProductFarmDetails,
    updateSearchResult,
    updateSelectedField,
    updateSpecialPool,
    updateYieldFarmDetails
} from "./action";

enum farmSection {
    LIQUIDITY,
    STAKING,
    PRODUCT_FARM,
    NEW_LP,
    SECOND_NEW_LP,
}
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
        specialPool:
    | Array<{
        id: number | string;
        img: string;
        deposit: string;
        earn: string;
        type: string;
        totalLiquidity: number | string;
        tokenStaked: string[];
        RGPEarned: string;
        availableToken: string;
        ARYValue: number | string;
        inflationPerDay: number | string; 
        tokenPrice: number;
        totalVolumePerPool: number;
        farmingFee: number;
        pId:number;
        poolAllowance: string;
        poolVersion:string; 
      }>
    | undefined;
        productFarm: {
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
            RGPStaked:string
            }[];
            
    selectedField: farmSection
        // productFarm:any
        
}

const initialState: FarmingSearchState = {
    searchResult: undefined,
    newSearchResult: undefined,
    filterResult: undefined,
    newFilterResult: undefined,
    content: undefined,
     specialPool: [
    {
      id: "special",
      img: "rgp.svg",
      // deposit: 'RGP',
      deposit: "RGP",
      earn: "RGP",
      type: "RGP",
      ARYValue:0,
      totalLiquidity: "",
      // main issue 206432
      tokenStaked: ["RGP",""],
      RGPEarned: "",
      availableToken: "",
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 10793,
      poolAllowance: "",
      poolVersion: "2",
    }
  ],
    selectedField: farmSection.LIQUIDITY,
    productFarm:[{
        feature:"AutoTrade",
        percentageProfitShare:"25%",
        profitTimeLine:"6 months",
        totalLiquidity:"",
        estimatedTotalProfit:"1774000",
        deposit: "RGP",
        pid:93903,
        poolAllowance: "",
        type:"AT",
        RGPStaked:"",
        tokenStaked:""
    }],
    // selectedField: farmSection.LIQUIDITY
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
        .addCase(updateSelectedField, (farming, {payload: { value }}) => {
            return {
                ...farming,
                selectedField: value
  
            };
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

        .addCase(updateSpecialPool, (state, action) => {
            console.log({action},action.payload)
            const farms = action.payload.value;
            console.log({farms})
            if (farms !== undefined) {
              return {
                ...state,
                specialPool: farms,
                loading: false,
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
