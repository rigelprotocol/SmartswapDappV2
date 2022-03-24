import { createReducer } from "@reduxjs/toolkit";
import {
  updateSearchResult,
  clearSearchResult,
  updateFilterResult,
} from "./action";

export interface FarmingSearchState {
  searchResult: [] | undefined;
  filterResult: [] | undefined;
}

const initialState: FarmingSearchState = {
  searchResult: undefined,
  filterResult: undefined,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateSearchResult, (farming, { payload: { farmData } }) => {
      return {
        ...farming,
        searchResult: farmData,
      };
    })
    .addCase(updateFilterResult, (farming, { payload: { farmData } }) => {
      return {
        ...farming,
        filterResult: farmData,
      };
    })
    .addCase(clearSearchResult, (farming, {}) => {
      return {
        ...farming,
        searchResult: undefined,
        filterResult: undefined,
      };
    })
);
