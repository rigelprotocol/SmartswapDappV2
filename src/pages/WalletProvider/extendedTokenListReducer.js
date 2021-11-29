/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  GET_ALL_TOKEN,
  SET_USER_TOKEN,
  DELETE_USER_TOKEN,
  ADD_NEW_TOKEN_LIST,
  UPDATE_TOKEN_LIST,
  SET_MAIN_TOKEN_LIST,
  TOGGLE_DEFAULT_TOKEN_LIST,
  TOGGLE_USER_TOKEN_LIST,
  TOGGLE_MAIN_TOKEN_LIST,
} from './constants';

export const initialState = {
  toggleDisplay: true,
  appTokenList: [],
  defaultTokenList: [{ show: true }, { token: [] }],
  allTokenList: [],
  userTokenList: [{ show: true }, { token: [] }],
  mainTokenList: [{ show: false }, { token: [] }],
};
let userToken;
let filterList;
const ExtendedTokenList = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ALL_TOKEN:
        draft.defaultTokenList[1].token = action.payload;
        break;
      case UPDATE_TOKEN_LIST:
        draft.appTokenList = action.payload;
        break;
      case SET_USER_TOKEN:
        userToken = draft.userTokenList[1].token.filter(
          token => token.address !== action.payload.address,
        );
        userToken.push(action.payload);
        draft.userTokenList[1].token = userToken;
        !draft.appTokenList.includes(action.payload)
          ? draft.appTokenList.push(action.payload)
          : null;
        break;
      case DELETE_USER_TOKEN:
        userToken = draft.userTokenList[1].token.filter(
          token => token.address !== action.payload,
        );
        draft.userTokenList[1].token = userToken;
        filterList = draft.appTokenList.filter(
          token => token.address !== action.payload,
        );
        draft.appTokenList = filterList;
        break;
      case ADD_NEW_TOKEN_LIST:
        filterList = draft.allTokenList.filter(
          data => data.name !== action.payload.name,
        );
        filterList.push(action.payload);
        draft.allTokenList = filterList;
        break;
      case TOGGLE_DEFAULT_TOKEN_LIST:
        draft.defaultTokenList[0].show = action.payload;
        break;
      case TOGGLE_USER_TOKEN_LIST:
        draft.userTokenList[0].show = action.payload;
        break;
      case TOGGLE_MAIN_TOKEN_LIST:
        draft.mainTokenList[0].show = action.payload;
        break;
      case SET_MAIN_TOKEN_LIST:
        draft.mainTokenList[1].token = action.payload;
        break;
      default:
        return state;
    }
  });

export default ExtendedTokenList;
