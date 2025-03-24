import { configureStore } from '@reduxjs/toolkit';





/**
 * 팩토리 패턴으로 변경 -> 사용자마다 스토어 격리 보장
 * @param initialState
 */
export function initializeStore(initialState = {}) {
    return configureStore({
        reducer: {},
        preloadedState: initialState,
    });
}

// RootState 및 AppDispatch 타입 정의
export type AppStore = ReturnType<typeof initializeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
