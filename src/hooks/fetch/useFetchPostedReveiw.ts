import { useEffect, useState } from 'react';

interface ReviewItem {
    createdAt: string;
    rating: number;
    content: string;
    gathering: {
        gatheringId: number;
        title: string;
        thumbnailUrl: string;
        startAt: string;
        endAt: string;
        maxParticipants: number;
        currentParticipants: number;
        preferredGender: string;
        preferredAge: string;
        host: {
            nickname: string;
            thumbnailUrl: string;
        };
    };
    hostProfile: {
        nickname: string;
        thumbnailUrl: string;
    };
}

interface ReviewResponse {
    content: ReviewItem[];
}

export const useFetchPostedReview = () => {
    const [postedReview, setPostedReview] = useState<ReviewItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/me/reviews/received`,
                    {
                        credentials: 'include',
                    },
                );
                if (!res.ok) {
                    throw new Error(
                        `API 응답 오류: ${res.status} ${res.statusText}`,
                    );
                }
                const data: ReviewResponse = await res.json();
                setPostedReview(data.content);
            } catch (e) {
                console.error('작성소감 조회실패:', e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { postedReview, isLoading };
};
