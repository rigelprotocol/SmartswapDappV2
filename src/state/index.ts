import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import toastReducers from "../components/Toast/toastSlice";
import application from "./application/reducer";
import swap from "./swap/reducer";
import lists from "./lists/reducer";
import user from "./user/reducer";
import blockReducer from "./block";
import transactions from "./transaction/reducer";
import mint from "./mint/reducer";
import farms from "./farm/reducer";
import gas from "./gas/reducer";
import farming from "./farming/reducer";
import newfarm from "./newfarm/reducer";
import lpfarm from "./LPFarm/reducer";
import newFarming from "./newFarming/reducer";
import chainId from "./chainId/reducer";

const PERSISTED_KEYS: string[] = ["user", "lists", "gas", "newfarm"];

const store = configureStore({
  reducer: {
    toast: toastReducers,
    block: blockReducer,
    application,
    transactions,

    // Exchange
    swap,
    user,

    mint,

    lists,

    farms,
    gas,
    farming,
    newfarm,
    lpfarm,
    newFarming,
    chainId
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: true }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
