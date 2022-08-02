import { createAction } from '@reduxjs/toolkit'

export interface valuenterface {
    reserves0?: any
    reserves1?: any,
    symbol0?: any,
    symbol1?: any
}



export const changeFarmingContent = createAction<{ value: valuenterface }>('farm/changeFarmingContent');
export const updateTotalLiquidity = createAction<{ liquidity: any, apy: any, deposit: string}[]>('farm/updateTotalLiquidity');
export const updateFarmProductLiquidity = createAction<{ liquidity: any, deposit: string}[]>('farm/updateFarmProductLiquidity');
export const updateTokenStaked = createAction<{  staked: any, earned: any,symbol?:string }[]>('farm/updateTokenStaked');
export const updateProductStaked = createAction<{  staked: any, }[]>('farm/updateProductStaked');
export const updateFarmAllowances = createAction<any[]>('farm/updateFarmAllowances');
export const updateFarmProductAllowances = createAction<any[]>('farm/updateFarmProductAllowances');
export const updateFarmBalances = createAction<any[]>('farm/updateFarmBalances');
export const updatePoolId = createAction<number[]>('farm/updatePoolId');
export const setLoadingState = createAction('farm/setLoadingState');
