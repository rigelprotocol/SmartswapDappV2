import { createAction } from "@reduxjs/toolkit";

export const updateFarms = createAction<{ value: any[] }>(
    "lpfarm/updateFarms"
);

export const updateSpecialPool = createAction<{ value: any[] }>(
    "lpfarm/updateSpecialPool"
);

export const updateLoadingState = createAction<{ value: boolean }>(
    "lpfarm/updateLoadingState"
);

export const updateChainId = createAction<{ value: number }>(
    "lpfarm/updateChainId"
);

export const updateAllowance = createAction<{
    value: any;
}>("lpfarm/updateAllowance");
