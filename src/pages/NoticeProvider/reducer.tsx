/*
 *
 * NoticeProviderReducer reducer
 *
 */
import produce from 'immer';
import { OFF_NOTICE, DEFAULT_ACTION, NOTICE } from './constants';

export const initialState = {
  message: { title: null, body: null, type: null },
  showNotice: false,
};

/* eslint-disable default-case, no-param-reassign */
const NoticeProviderReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case NOTICE:
        draft.message = action.message;
        draft.showNotice = true;
        break;
      case OFF_NOTICE:
        draft.showNotice = false;
        draft.message = { title: null, body: null, type: null };
    }
  });

export default NoticeProviderReducer;
