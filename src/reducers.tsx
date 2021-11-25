/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import FarmingV2ProviderReducer from './pages/FarmingV2/reducer'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer() {
  const rootReducer = combineReducers({
    farmingv2: FarmingV2ProviderReducer,
  });

  return rootReducer;
}
