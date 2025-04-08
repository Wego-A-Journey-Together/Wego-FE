import { configureStore } from '@reduxjs/toolkit';

import filterReducer from './slices/filterSlice';
import localeReducer from './slices/localeSlice';
import modalReducer from './slices/modalSlice';
import userReducer from './slices/userSlice';

/**
 * 팩토리 패턴으로 변경 -> 사용자마다 스토어 격리 보장
 * @param initialState
 */
export function initializeStore(initialState = {}) {
    return configureStore({
        reducer: {
            filter: filterReducer,
            user: userReducer,
            locale: localeReducer,
            modal: modalReducer,
        }, // '나와 함께 할 동행 찾기' 필터링 슬라이스
        preloadedState: initialState,
    });
}

// RootState 및 AppDispatch 타입 정의
export type AppStore = ReturnType<typeof initializeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
