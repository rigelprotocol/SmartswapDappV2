import { createReducer } from '@reduxjs/toolkit';
import {changeFarmingContent,
  updateTokenStaked, 
  updateTotalLiquidity, 
  updateFarmAllowances, 
  updateFarmBalances,
updatePoolId} from './actions'


export interface farmStateInterface {
  loading?: boolean
  error?: any
  contents:Array< {
    id: string,
    img: string,
    deposit: string,
    earn: string,
    ARYValue: any,
    type?: string,
    totalLiquidity: any,
    tokensStaked: Array<string>,
    RGPEarned?: string,
    availableToken: string,
    inflationPerDay?: number,
    tokenPrice?: number,
    totalVolumePerPool?: number,
    farmingFee?: number,
    pId?: number,
    poolAllowance?: any,
  }>
}

export const initialState: farmStateInterface = {
  loading: false,
  error: null,
  contents:  [
    {
      id: '1',
      img: 'rgp.svg',
      // deposit: 'RGP',
      deposit: 'RGP',
      earn: 'RGP',
      type: 'RGP',
      ARYValue: '0',
      totalLiquidity: '1223',
      tokensStaked: ['RGP', '0'],
      RGPEarned: '0',
      availableToken: '',
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 0,
      poolAllowance: '',
    },
    {
      id: '2',
      img: 'rgp.svg',
      deposit: 'RGP-BNB',
      earn: 'RGP',
      type: 'LP',
      ARYValue: '1625',
      totalLiquidity: '1221',
      tokensStaked: ['RGP-BNB', '1'],
      RGPEarned: '0',
      availableToken: '3.747948393',
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 2,
      poolAllowance: '',
    },
    {
      id: '3',
      img: 'rgp.svg',
      // changed from
      // deposit: 'RGP-BUSD', to
      deposit: 'RGP-BUSD',
      earn: 'RGP',
      type: 'LP',
      ARYValue: '725',
      totalLiquidity: '2121',
      tokensStaked: ['RGP-BUSD', '0'],
      RGPEarned: '0',
      availableToken: '3.747948393',
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 1,
      poolAllowance: '',
    },

    {
      id: '4',
      img: 'rgp.svg',
      // changed from
      // deposit: 'BNB-BUSD', to
      deposit: 'BNB-BUSD',
      earn: 'RGP',
      ARYValue: '23',
      type: 'LP',
      totalLiquidity: '232',
      tokensStaked: ['BNB-BUSD', '0'],
      RGPEarned: '0',
      availableToken: '3.747948393',
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 3,
      poolAllowance: '',
    },
    {
      id: '5',
      img: 'rgp.svg',
      // changed from
      // deposit: 'BNB-BUSD', to
      deposit: 'AXS-RGP',
      earn: 'RGP',
      ARYValue: '23',
      type: 'LP',
      totalLiquidity: '212',
      tokensStaked: ['AXS-RGP', '0'],
      RGPEarned: '0',
      availableToken: '3.747948393',
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 4,
      poolAllowance: '',
    },
    {
      id: '6',
      img: 'rgp.svg',
      deposit: 'AXS-BUSD',
      earn: 'RGP',
      ARYValue: '325',
      type: 'LP',
      totalLiquidity: '212',
      tokensStaked: ['AXS-BUSD', '0'],
      RGPEarned: '0',
      availableToken: '3.747948393',
      inflationPerDay: 0,
      tokenPrice: 0,
      totalVolumePerPool: 0,
      farmingFee: 0,
      pId: 5,
      poolAllowance: '',
    },
  ],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(changeFarmingContent, (state, action) => {
        const id = `${action.payload.value.symbol0}-${action.payload.value.symbol1}`;
        let current = state.contents.findIndex(obj => obj.deposit === id);
      
        if (current >= 0) {
            state.contents[current].totalLiquidity =
              parseInt(action.payload.value.reserves1) +
              parseInt(action.payload.value.reserves0);
          }
    })

  .addCase(updateTotalLiquidity, (state, action) => {
        const totalLiquidity = action.payload;
        
         totalLiquidity.forEach((item, index) => {
          state.contents[index].totalLiquidity = item.liquidity;
          state.contents[index].ARYValue = item.apy;
          state.contents[index].deposit = item.deposit;
        });
     
    })

  .addCase(updateTokenStaked, (state, action) => {
    const stakedToken = action.payload;
    stakedToken.forEach((item, index) => {
      state.contents[index].tokensStaked = [
        state.contents[index].tokensStaked[0],
        item.staked,
      ];
      state.contents[index].RGPEarned = item.earned;
    });
  })

  .addCase(updateFarmAllowances, (state, action) => {
    const allowances = action.payload;
    allowances.forEach((item, index) => {
      state.contents[index].poolAllowance = item;
    });
  })

  .addCase(updateFarmBalances, (state, action) => {
    const balances = action.payload;
        balances.forEach((item, index) => {
          state.contents[index].availableToken = item;
        });
  })

  .addCase(updatePoolId, (state, action) => {
    const poolIds = action.payload;
        poolIds.forEach((item, index) => {
          state.contents[index].pId = item;
        });
  })
  

    
)
