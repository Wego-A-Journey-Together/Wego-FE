import CommentBundle from '@/components/detail/CommentBundle';

export default async function PostComment({ postId }: { postId: number }) {
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    let comments = undefined;

    try {
        const data = await fetch(
            // 댓글과 대댓글 합쳐서 피그마 참고해서 7로 잡았습니다.
            `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${postId}/comments?page=0&size=7`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        comments = await data.json();
    } catch (e) {
        console.error('댓글 조회 실패', e);
    }

    return (
        <div>
            {/*댓글 헤더*/}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {comments?.totalElements}
            </h2>

            <CommentBundle initialComments={comments?.content} />
        </div>
    );
}
