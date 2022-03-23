import { createAction } from '@reduxjs/toolkit'



export const updateNftData = createAction<{ name: string, image: string, id: number}[]>('nft/updateNftData');


// export const updateTokenStaked = createAction<{  staked: any, earned: any }[]>('farm/updateTokenStaked');
// export const updateFarmAllowances = createAction<any[]>('farm/updateFarmAllowances');
// export const updateFarmBalances = createAction<any[]>('farm/updateFarmBalances');
// export const updatePoolId = createAction<number[]>('farm/updatePoolId');
