'use client';

import { useEffect, useState } from 'react';

/**
 * 현재 화면 사이즈와 query 를 비교하여 상태를 반환하는 커스텀 훅
 * @param query
 */
export default function useMediaQuery(query: string) {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        // 브라우저에서 실행되도록 보장하기
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);

        // query 와 현재 화면이 매치되는지 체크후 matches 에 저장
        setMatches(mediaQuery.matches);

        //변경시 추적
        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        //클린업
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}
