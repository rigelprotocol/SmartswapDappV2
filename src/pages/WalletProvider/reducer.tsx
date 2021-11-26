/*
 *
 * WalletProvider reducer
 *
 */
import produce from 'immer';
import { getSelectedTokenDetails } from '../../utils/utilsFunctions';
import {
  DEFAULT_ACTION,
  WALLET_CONNECTED,
  WALLET_PROPS,
  LOADING_WALLET,
  CLEAR_WALLET,
  CLOSE_LOADING_WALLET,
  CHANGE_DEADLINE,
  CHANGE_BNB,
  UPDATE_CHAIN_ID,
  UPDATE_TO_TOKEN,
  UPDATE_FROM_TOKEN,
  UPDATE_RGP_PRICE
} from './constants';

export const initialState = {
  wallet: {
    balance: 0,
    address: '0x',
    provider: 'provider',
    signer: 'signer',
    chainId: 'chainId',
  },
  wallet_props: '0.0000',
  connected: false,
  loading: false,
  transactionDeadLine: '1378747',
  slippageValue: '383993939993',
  swapOutputToken: {},
  swapInputToken: {},
  RGPprice: ''
};

/* eslint-disable default-case, no-param-reassign */
const walletProviderReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOADING_WALLET:
        draft.loading = action.payload;
        break;
      case CLOSE_LOADING_WALLET:
        draft.loading = action.payload;
        break;
      case WALLET_CONNECTED:
        draft.wallet = action.wallet;
        draft.connected = true;
        draft.loading = false;
        break;
      case WALLET_PROPS:
        draft.wallet_props = action.payload.rgpBalance;
        break;
      case CHANGE_BNB:
        draft.wallet.balance = action.payload.balance;
        break;
      case CLEAR_WALLET:
        draft.wallet = {
          balance: 0,
          address: '0x',
          provider: 'provider',
          signer: 'signer',
          chainId: 'chainId',
        };
        draft.connected = false;
        draft.wallet_props = '0.0000';
        draft.loading = false;
        break;
      case CHANGE_DEADLINE:
        draft.transactionDeadLine = action.payload.actualTransactionDeadline;
        draft.slippageValue = action.payload.slippageValue;
        break;
      case UPDATE_CHAIN_ID:
        draft.wallet.chainId = action.payload;
        break;
      case UPDATE_TO_TOKEN:
        draft.swapOutputToken = getSelectedTokenDetails(action.payload.symbol);
        break;
      case UPDATE_FROM_TOKEN:
        draft.swapInputToken = getSelectedTokenDetails(action.payload.symbol);
        break;
        case UPDATE_RGP_PRICE:
        draft.RGPprice = action.payload;
        break;
      default:
        return state;
    }
  });

export default walletProviderReducer;
