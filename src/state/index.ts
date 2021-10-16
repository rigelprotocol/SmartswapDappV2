import { configureStore } from '@reduxjs/toolkit'
import modalReducer from '../components/Modals/TransactionsModal/reducers';


const store = configureStore({
    reducer: {
        modalReducer
    },

})


export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
