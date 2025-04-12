'use client';

import { MyJoin } from '@/hooks/fetch/useFetchMyJoin';
import { useEffect, useState } from 'react';

export default function useFetchReviewables() {
    const [reviewables, setReviewables] = useState<MyJoin[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/reviews/unwritten`,
                    {
                        credentials: 'include',
                    },
                );
                if (!res.ok) {
                    throw new Error(
                        `API 응답 오류: ${res.status} ${res.statusText}`,
                    );
                }
                const data: MyJoin[] = await res.json();
                setReviewables(data);
            } catch (e) {
                console.error('내가 참여하는 동행 조회 실패함:', e);
            }
        })();
    }, []);

    return { reviewables };
}
