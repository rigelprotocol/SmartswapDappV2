import { createSlice } from '@reduxjs/toolkit'


export enum TrxState {
    WaitingForConfirmation,
    TransactionSubmitted,
    TransactionSuccessful,
    TransactionFailed,
}

export interface modalState {
    message?: string;
    trxState: TrxState;
    urlNetwork?: string;
}

type ModalState = {
    modal: modalState | null | undefined
};

const initialState: ModalState = {
    modal: null,
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setOpenModal(state, action) {
            state.modal = action.payload
        },
        setCloseModal(state) {
            state.modal = null
        },
    },
})

export const {
    setOpenModal,
    setCloseModal
} = applicationSlice.actions
export default applicationSlice.reducer