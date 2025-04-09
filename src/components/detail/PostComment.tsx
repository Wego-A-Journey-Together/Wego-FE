import CommentBundle, { Comment } from '@/components/detail/CommentBundle';





/**
 * 첫 페이지는 서버사이드 랜더링으로 불러와서 내려줍니다.
 * 이후 페이지는 더보기 버튼을 클릭시마다 fetch 해서 불러오고, 마지막 페이지에서는 댓글 접기로 변경
 * @param postId
 * @constructor
 */
export default async function PostComment({ postId }: { postId: number }) {
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    let comments = undefined;
    let initialComments: Comment[] = [];

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
        initialComments = comments.content;
    } catch (e) {
        console.error('댓글 조회 실패', e);
    }

    return (
        <div>
            {/*댓글 헤더*/}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {comments?.totalElements}
            </h2>
            {!!comments && initialComments.length > 0 ? (
                initialComments.map((set, setIndex) => (
                    <CommentBundle key={setIndex} bundle={set} />
                ))
            ) : (
                <div>댓글없음</div>
            )}
        </div>
    );
}
