/*
 *
 * FarmingPage actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_FARMING_CONTENT,
  CHANGE_FARMING_CONTENT_TOKEN,
  CHANGE_RGP_FARMING_FEE,
  UPDATE_TOTAL_LIQUIDITY,
  UPDATE_TOKEN_STAKED,
  UPDATE_FARM_BALANCES,
  UPDATE_FARM_ALLOWANCE,
  FARM_DATA_LOADING,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export const changeFarmingContent = value => dispatch => {
  dispatch({ type: CHANGE_FARMING_CONTENT, payload: value });
};
export const changeFarmingContentToken = value => dispatch => {
  dispatch({ type: CHANGE_FARMING_CONTENT_TOKEN, payload: value });
};
export const changeRGPFarmingFee = value => dispatch => {
  dispatch({ type: CHANGE_RGP_FARMING_FEE, payload: value });
};

export const updateTotalLiquidity = value => dispatch => {
  dispatch({ type: UPDATE_TOTAL_LIQUIDITY, payload: value });
};

export const updateTokenStaked = value => dispatch => {
  dispatch({ type: UPDATE_TOKEN_STAKED, payload: value });
};

export const updateFarmBalances = value => dispatch => {
  dispatch({ type: UPDATE_FARM_BALANCES, payload: value });
};

export const updateFarmAllowances = value => dispatch => {
  dispatch({ type: UPDATE_FARM_ALLOWANCE, payload: value });
};

export const farmDataLoading = value => dispatch => {
  dispatch({ type: FARM_DATA_LOADING, payload: value });
};
