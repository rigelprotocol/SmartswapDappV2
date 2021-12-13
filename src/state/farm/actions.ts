import { createAction } from '@reduxjs/toolkit'

export interface valuenterface {
    reserves0?: any
    reserves1?: any,
    symbol0?: any,
    symbol1?: any
}



export const changeFarmingContent = createAction<{ value: valuenterface }>('farm/changeFarmingContent');
export const updateTotalLiquidity = createAction<{ liquidity: any, apy: any}[]>('farm/updateTotalLiquidity');
export const updateTokenStaked = createAction<{  staked: any, earned: any }[]>('farm/updateTokenStaked');
export const updateFarmAllowances = createAction<any[]>('farm/updateFarmAllowances');
export const updateFarmBalances = createAction<any[]>('farm/updateFarmBalances');

