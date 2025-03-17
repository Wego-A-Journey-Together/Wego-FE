import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {},
});

// RootState 및 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
