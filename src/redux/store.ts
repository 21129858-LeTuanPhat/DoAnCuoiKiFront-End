import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer';
import callReducer from './callReducer'
const store = configureStore({
    reducer: {
        user: userReducer,
        call: callReducer
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;