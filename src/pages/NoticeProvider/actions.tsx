/*
 *
 * NoticeProvider actions
 *
 */

import { DEFAULT_ACTION, NOTICE, OFF_NOTICE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const notify = message => dispatch =>
  dispatch({
    type: NOTICE,
    message,
  });

export const offNotice = () => dispatch => dispatch({ type: OFF_NOTICE });

export const showErrorMessage = error => dispatch => {
  switch (error.code) {
    case 4001:
      return dispatch({
        type: NOTICE,
        message: {
          title: 'Error Response',
          type: 'error',
          body: 'You have rejected the request',
        },
      });
    case -32602:
      return dispatch({
        type: NOTICE,
        message: {
          title: 'Error Response',
          type: 'error',
          body:
            'Transaction execution reverted because of the parameters were invalid',
        },
      });
    case 'UNPREDICTABLE_GAS_LIMIT' || -32603:
      return dispatch({
        type: NOTICE,
        message: {
          title: 'Error Response',
          type: 'error',
          body: error.message,
        },
      });
    case -32000:
      return dispatch({
        type: NOTICE,
        message: {
          title: 'Error Response',
          type: 'error',
          body:
            'Transaction execution reverted because of UNPREDICTABLE GAS LIMIT',
        },
      });
    default:
      dispatch({
        type: NOTICE,
        message: {
          title: 'Error Response',
          type: 'error',
          body: error.message,
        },
      });
  }
};
