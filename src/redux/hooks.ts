import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

/**
 * useDispatch에 AppDispatch 타입 적용
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 *  useSelector에 RootState 타입 적용
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
