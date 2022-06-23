import { createAction } from "@reduxjs/toolkit";
import { farmStateInterface } from "../farm/reducer";

export const updateSearchResult = createAction<{
  farmData: [] | undefined;
}>("farming/updateSearchResult");

export const updateNewSearchResult = createAction<{
  farmData: [] | undefined;
}>("farming/updateNewSearchResult");

export const updateFilterResult = createAction<{
  farmData: [] | undefined;
}>("farming/updateFilterResult");

export const updateNewFilterResult = createAction<{
  farmData: [] | undefined;
}>("farming/updateNewFilterResult");

export const clearSearchResult = createAction("farming/clearSearchResult");

export const updateYieldFarmDetails = createAction<{ value: any[] }>(
  "farming/updateYieldFarmDetails"
);
export const updateProductFarmDetails = createAction<{ value: any[] }>(
  "farming/updateProductFarmDetails"
);

export const updateSelectedField = createAction<{ value: any }>(
    "farming/updateSelectedField"
);

export const clearAllFarms = createAction("farming/clearAllFarms");
