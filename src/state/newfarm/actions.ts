import { createAction } from "@reduxjs/toolkit";

export const updateFarms = createAction<{ value: any[] }>(
  "newfarm/updateFarms"
);


export const updateLoadingState = createAction<{ value: boolean }>(
  "newfarm/updateLoadingState"
);

export const updateChainId = createAction<{ value: number }>(
  "newfarm/updateChainId"
);

export const updateFarmAllowances = createAction<any[]>('newfarm/updateFarmAllowances');
export const updateFarmProductAllowances = createAction<any[]>('newfarm/updateFarmProductAllowances');

export const updateAllowance = createAction<{
  value: any;
}>("newfarm/updateAllowance");
