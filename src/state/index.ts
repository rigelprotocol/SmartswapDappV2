import { configureStore } from '@reduxjs/toolkit';
import toastReducers from '../components/Toast/toastSlice';

const store = configureStore({
    reducer: {
        toast: toastReducers
    },

});


export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
