import { Comment } from '@/components/comment/CommentBundle';





export type SpringCommentResponse = {
    content: Comment[];
    totalElements: number;
    last: boolean;
};

/**
 * <server only>
 * 게시글 기준 초기 댓글 SSR 하는 유틸함수
 * @param postId
 */
export async function fetchInitialComments(
    postId: number,
): Promise<SpringCommentResponse> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${postId}/comments?page=0&size=7`,
        {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
        },
    );

    if (!res.ok) throw new Error('댓글 초기 로딩 실패');

    return await res.json();
}
