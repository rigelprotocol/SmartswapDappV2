import { createAction } from "@reduxjs/toolkit";

export const updateSearchResult = createAction<{
    farmData: [] | undefined;
}>("newFarming/updateSearchResult");

export const updateNewSearchResult = createAction<{
    farmData: [] | undefined;
}>("newFarming/updateNewSearchResult");

export const updateFilterResult = createAction<{
    farmData: [] | undefined;
}>("newFarming/updateFilterResult");

export const updateNewFilterResult = createAction<{
    farmData: [] | undefined;
}>("newFarming/updateNewFilterResult");

export const clearSearchResult = createAction("newFarming/clearSearchResult");

export const updateYieldFarmDetails = createAction<{ value: any[] }>(
    "newFarming/updateYieldFarmDetails"
);
export const updateProductFarmDetails = createAction<{ value: any[] }>(
    "newFarming/updateProductFarmDetails"
);

export const clearAllFarms = createAction("newFarming/clearAllFarms");
