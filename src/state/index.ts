import { configureStore } from '@reduxjs/toolkit';
import toastReducers from '../components/Toast/toastSlice';
import application from './application/reducer'

const store = configureStore({
    reducer: {
        toast: toastReducers,
        application
    },
});

export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
