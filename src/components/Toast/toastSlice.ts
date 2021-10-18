import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ToastState {
    message: string,
    URL?: string
}

const initialState: ToastState = {
    message: '',
    URL: ''
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: (state , action: PayloadAction<ToastState>) => {
            state.message = action.payload.message;
            state.URL = action.payload.URL;
        },
        removeToast: (state) => {
            state.message = '';
        }
    }
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;