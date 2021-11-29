/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from './utils/history';
import NoticeProviderReducer from './pages/NoticeProvider/reducer';
import WalletProviderReducer from './pages/WalletProvider/reducer';
import TokenListReducer from './pages/WalletProvider/extendedTokenListReducer';
import FarmingV2ProviderReducer from './pages/FarmingV2/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer() {
  const rootReducer = combineReducers({
    notice: NoticeProviderReducer,
    wallet: WalletProviderReducer,
    ExtendedTokenList: TokenListReducer,
    farmingv2: FarmingV2ProviderReducer,
    router: connectRouter(history),
  });

  return rootReducer;
}
