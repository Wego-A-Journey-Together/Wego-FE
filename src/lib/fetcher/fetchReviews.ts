export interface ReviewItem {
    writer: {
        nickname: string;
        thumbnailUrl: string;
    };
    createdAt: string;
    rating: number;
    content: string;
}

export type SpringReviewResponse = {
    content: ReviewItem[];
    totalElements: number;
    last: boolean;
};

/**
 * 게시글 기준 초기 소감 SSR 하는 유틸함수
 * @param postId
 * @param page
 */
export async function fetchReviews(postId: number, page: number = 0) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/reviews/gathering/${postId}?page=${page}&size=5`,
        {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
        },
    );

    if (!res.ok) throw new Error('소감 초기 로딩 실패');

    return await res.json();
}
