import { configureStore } from '@reduxjs/toolkit'
import application from './application/reducer'

const store = configureStore({
    reducer: {
        application
    },

})

export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
