import {ModalProps} from './TransactionStateModal'

export enum ModalActionTypes {
    ShowModal,
    HideModal,
  }
  
  export interface ModalAction {
    type: ModalActionTypes;
    payload?: ModalProps;
  }
  
  export function showModal(payload: ModalProps): ModalAction {
    return {
      type: ModalActionTypes.ShowModal,
      payload,
    };
  }
  export function hideModal(): ModalAction {
    return {
      type: ModalActionTypes.HideModal,
    };
  }

 
  