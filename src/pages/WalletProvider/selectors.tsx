import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the walletProvider state domain
 */

const selectWalletProviderDomain = state =>
  state.walletProvider || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by WalletProvider
 */

const makeSelectWalletProvider = () =>
  createSelector(
    selectWalletProviderDomain,
    substate => substate,
  );

export default makeSelectWalletProvider;
export { selectWalletProviderDomain };
