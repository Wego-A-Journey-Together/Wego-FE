'use client';

import { useEffect, useState } from 'react';

export interface MyJoin {
    gatheringId: number;
    title: string;
    thumbnailUrl: string;
    startAt: string;
    endAt: string;
    preferredGender: string;
    preferredAge: string;
    maxParticipants: number;
    currentParticipants: number;
    host: {
        nickname: string;
        thumbnailUrl: string;
    };
}

export default function useFetchMyJoin() {
    const [upcoming, setUpcoming] = useState<MyJoin[]>([]);
    const [closed, setClosed] = useState<MyJoin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/me/gathering/joined`,
                    {
                        credentials: 'include',
                    },
                );

                const data: MyJoin[] = await res.json();
                const now = new Date();
                const future = data.filter(
                    ({ endAt }) => new Date(endAt) > now,
                );
                const past = data.filter(({ endAt }) => new Date(endAt) <= now);
                setUpcoming(future);
                setClosed(past);
            } catch (e) {
                console.error('내가 참여하는 동행 조회 실패함:', e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { upcoming, closed, isLoading };
}
