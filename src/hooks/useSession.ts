'use client';

import { useAppSelector } from '@/redux/hooks';

/**
 * GNB 구조 때문에 모든 페이지에서 로그인 상태 store 조회가 필요합니다.
 * SSR -> initialstate 에 주입된 유저 로그인 세션을 불러오는 커스텀 훅 입니다.
 * 가벼운 값들이라 펼쳐서 모두 반환하도록 구성했습니다.
 */
export const useSession = () => {
    const user = useAppSelector((state) => state.user);

    return {
        isAuthenticated: user.isAuthenticated,
        nickname: user.info?.nickname,
        email: user.info?.email,
        kakaoId: user.info?.kakaoId,
    };
};
