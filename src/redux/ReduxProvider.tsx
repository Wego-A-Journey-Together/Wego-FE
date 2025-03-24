'use client';

import { AppStore, initializeStore } from '@/redux/store';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';

interface Props {
    children: React.ReactNode;
    initialLang?: string;
}

const ReduxProvider: React.FC<Props> = ({ children }) => {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        // 초기 상태로 스토어 생성 (필요한 초기값 설정)
        storeRef.current = initializeStore({});
    }
    return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
