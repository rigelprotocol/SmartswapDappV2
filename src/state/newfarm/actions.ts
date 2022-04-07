import { createAction } from "@reduxjs/toolkit";

export const updateFarms = createAction<{ value: any[] }>(
  "newfarm/updateFarms"
);

export const updateSpecialPool = createAction<{ value: any[] }>(
  "newfarm/updateSpecialPool"
);

export const updateLoadingState = createAction<{ value: boolean }>(
  "newfarm/updateLoadingState"
);

export const updateAllowance = createAction<{
  value: any;
}>("newfarm/updateAllowance");
