import { combineReducers } from '@reduxjs/toolkit';
import { ModalAction, ModalActionTypes } from './actions';
import { ModalProps } from './TransactionStateModal'

type ModalState = {
  modal: ModalProps | null | undefined;
};

const initialState: ModalState = {
  modal: null,
};

function modalReducer(state = initialState, action: ModalAction): ModalState {
  switch (action.type) {
    case ModalActionTypes.ShowModal:
      return {
        ...state,
        modal: action.payload,
      };
    case ModalActionTypes.HideModal:
      return {
        ...state,
        modal: null,
      };
    default:
      return state;
  }
}




export default modalReducer;