import { createAction } from "@reduxjs/toolkit";
import { farmStateInterface } from "../farm/reducer";

export const updateSearchResult = createAction<{
  farmData: [] | undefined;
}>("farming/updateSearchResult");

export const updateFilterResult = createAction<{
  farmData: [] | undefined;
}>("farming/updateFilterResult");

export const clearSearchResult = createAction("farming/clearSearchResult");
