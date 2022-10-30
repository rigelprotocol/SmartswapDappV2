import { createReducer } from "@reduxjs/toolkit";
import { stat } from "fs";
import {
  updateAllowance,
  updateFarms,
  updateLoadingState,
  updateSpecialPool,
  updateChainId,
  updateFarmAllowances,
  updateFarmProductAllowances,
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
  // specialPool:
  //   | Array<{
  //       id: number | string;
  //       img: string;
  //       deposit: string;
  //       earn: string;
  //       type: string;
  //       totalLiquidity: number | string;
  //       tokenStaked: string[];
  //       RGPEarned: string;
  //       availableToken: string;
  //       ARYValue: number | string;
  //       inflationPerDay: number | string; 
  //       tokenPrice: number;
  //       totalVolumePerPool: number;
  //       farmingFee: number;
  //       pId:number;
  //       poolAllowance: string;
  //       poolVersion:string; 
  //     }>
  //   | undefined;
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
      }[]
}
export interface farmStateInterface {
  loadingValue?: boolean;
  error?: any;
  contents: Array<{
    id: string;
    img: string;
    deposit: string;
    earn: string;
    ARYValue: any;
    type?: string;
    totalLiquidity: any;
    tokenStaked: Array<string>;
    RGPEarned?: string;
    availableToken: string;
    inflationPerDay?: number;
    tokenPrice?: number;
    totalVolumePerPool?: number;
    farmingFee?: number;
    pId?: number;
    poolAllowance?: any;
    poolVersion?: string;
  }>;
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
    }[]
}
const initialState: farmDataInterface = {
  loading: false,
  contents: undefined,
  // specialPool: [
  //   {
  //     id: "special",
  //     img: "rgp.svg",
  //     // deposit: 'RGP',
  //     deposit: "RGP",
  //     earn: "RGP",
  //     type: "RGP",
  //     ARYValue:0,
  //     totalLiquidity: "",
  //     // main issue 206432
  //     tokenStaked: ["RGP",""],
  //     RGPEarned: "",
  //     availableToken: "",
  //     inflationPerDay: 0,
  //     tokenPrice: 0,
  //     totalVolumePerPool: 0,
  //     farmingFee: 0,
  //     pId: 10793,
  //     poolAllowance: "",
  //     poolVersion: "2",
  //   }
  // ],
  chainId: 56,
  productFarm :[
    {
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
    }
  ]
};




export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateFarms, (state, action) => {
      console.log(action.payload)
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

    .addCase(updateChainId, (state, action) => {
      const chainId = action.payload.value;

      return {
        ...state,
        chainId: chainId,
      };
    })
    .addCase(updateFarmAllowances, (state, action) => {
      const allowances = action.payload;
      console.log(allowances.length,allowances)
      // allowances.forEach((item, index) => {
      //   state?.contents[index].poolAllowance = item;
      // });
    })

    .addCase(updateFarmProductAllowances, (state, action) => {
      const allowances = action.payload;
      console.log({allowances})
      allowances.forEach((item, index) => {
        state.productFarm[index].poolAllowance = item;
      });
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
