import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import toastReducers from '../components/Toast/toastSlice';
import application from './application/reducer'
import swap from "./swap/reducer"
import lists from "./lists/reducer"
import user from './user/reducer'
import blockReducer from "./block"
import mint from './mint/reducer'

const PERSISTED_KEYS: string[] = ['user','lists']

const store = configureStore({
    reducer: {
        toast: toastReducers,
        block: blockReducer,
        application,

        // Exchange
        swap,
        user,

        mint,

        lists

    },
  middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
