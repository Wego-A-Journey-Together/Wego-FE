import { useEffect, useState } from 'react';

interface Review {
    gatheringId?: number;
    thumbnailUrl?: string;
    writer: {
        nickname: string;
        thumbnailUrl: string;
    };
    createdAt: string;
    rating: number;
    content: string;
}

interface ReviewRes {
    totalElements: number;
    content: Review[];
}

export default function useFetchReivedReview() {
    const [receivedReview, setReceivedReview] = useState<Review[]>([]);
    const [totalRecieved, setTotalRecieved] = useState<number>(0);
    useEffect(() => {
        (async () => {
            try {
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
                const data: ReviewRes = await res.json();
                setReceivedReview(data.content);
                setTotalRecieved(data.totalElements);
            } catch (e) {
                console.error('내가 참여하는 동행 조회 실패함:', e);
            }
        })();
    }, []);

    return { totalRecieved, receivedReview };
}
