import { createReducer } from "@reduxjs/toolkit";
import {
  changeFarmingContent,
  updateTokenStaked,
  updateTotalLiquidity,
  updateFarmAllowances,
  updateFarmProductAllowances,
  updateFarmBalances,
  updatePoolId,
  updateFarmProductLiquidity,
  updateProductStaked,
  setLoadingState
} from "./actions";

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
    tokensStaked: Array<string>;
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
  productFarm?: any
}

export const initialState: farmStateInterface = {
  loadingValue: false,
  error: null,
  contents: [
    // {
    //   id: "1",
    //   img: "rgp.svg",
    //   // deposit: 'RGP',
    //   deposit: "RGP",
    //   earn: "RGP",
    //   type: "RGP",
    //   ARYValue: "0",
    //   totalLiquidity: "1223",
    //   tokensStaked: ["RGP", "0"],
    //   RGPEarned: "0",
    //   availableToken: "",
    //   inflationPerDay: 0,
    //   tokenPrice: 0,
    //   totalVolumePerPool: 0,
    //   farmingFee: 0,
    //   pId: 0,
    //   poolAllowance: "",
    // },
    {
      id: "13",
      img: "rgp.svg",
      // deposit: 'RGP',
      deposit: "RGP",
      earn: "RGP",
      type: "RGP",
      ARYValue: "0",
      totalLiquidity: "", //"1223",
      tokensStaked: ["RGP", "0"],
      RGPEarned: "0",
      availableToken: "",
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 10793,
      poolAllowance: "",
      poolVersion: "2",
    },
  ],
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
      RGPStaked:""
    }
  ]
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(changeFarmingContent, (state, action) => {
      const id = `${action.payload.value.symbol0}-${action.payload.value.symbol1}`;
      let current = state.contents.findIndex((obj) => obj.deposit === id);

      if (current >= 0) {
        state.contents[current].totalLiquidity =
          parseInt(action.payload.value.reserves1) +
          parseInt(action.payload.value.reserves0);
      }
    })

    .addCase(updateTotalLiquidity, (state, action) => {
      const totalLiquidity = action.payload;
      console.log("totalLiquidity", totalLiquidity);
      totalLiquidity.forEach((item, index) => {
        state.contents[index].totalLiquidity = item.liquidity;
        state.contents[index].ARYValue = item.apy;
        state.contents[index].deposit = item.deposit;
      });
    })
    .addCase(updateFarmProductLiquidity, (state, action) => {
      const totalLiquidity = action.payload;

      totalLiquidity.forEach((item, index) => {
        state.productFarm[index].totalLiquidity = item.liquidity;
        // state.productFarm[index].ARYValue = item.apy;
        state.productFarm[index].deposit = item.deposit;
      });
    })

    .addCase(updateTokenStaked, (state, action) => {
      console.log(action.payload)
      const stakedToken = action.payload;
      // stakedToken.forEach((item, index) => {
      //   state.contents[index].tokensStaked = [
      //     state.contents[index].tokensStaked[0],
      //     item.staked,
      //   ];
      //   state.contents[index].RGPEarned = item.earned;
      // });
      let index =state.contents.findIndex((item)=>item?.poolVersion ==="2")
         state.contents[index].tokensStaked = [
          state.contents[index].tokensStaked[0],
          stakedToken[0].staked,
        ];
        state.contents[index].RGPEarned = stakedToken[0].earned;
    })
    .addCase(updateProductStaked, (state, action) => {
      const stakedToken = action.payload;
      console.log({stakedToken})
      state.productFarm[0].RGPStaked = stakedToken[0].staked
      // stakedToken.forEach((item, index) => {
      //   state.contents[index].tokensStaked = [
      //     state.contents[index].tokensStaked[0],
      //     item.staked,
      //   ];
      //   state.contents[index].RGPEarned = item.earned;
      // });
    })

    .addCase(updateFarmAllowances, (state, action) => {
      const allowances = action.payload;
      console.log(allowances.length,state.contents.length,"iieii")
      allowances.forEach((item, index) => {
        state.contents[index].poolAllowance = item;
      });
    })

    .addCase(updateFarmProductAllowances, (state, action) => {
      const allowances = action.payload;
      console.log({allowances})
      allowances.forEach((item, index) => {
        state.productFarm[index].poolAllowance = item;
      });
    })

    .addCase(updateFarmBalances, (state, action) => {
      const balances = action.payload;
      let index =state.contents.findIndex((item)=>item?.poolVersion ==="2")
       
        state.contents[index].availableToken = balances[0];
    })

    .addCase(updatePoolId, (state, action) => {
      const poolIds = action.payload;
      poolIds.forEach((item, index) => {
        state.contents[index].pId = item;
      });
    })
    .addCase(setLoadingState, (state, action) => {
      
      state.loadingValue = !state.loadingValue;
    })
);
