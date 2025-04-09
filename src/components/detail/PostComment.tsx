import CommentBundle from '@/components/detail/CommentBundle';
import { SpringCommentResponse } from '@/lib/fetcher/fetchInitialComments';

/**
 * 첫 페이지는 서버사이드 랜더링으로 불러와서 내려줍니다.
 * 이후 페이지는 더보기 버튼을 클릭시마다 fetch 해서 불러오고, 마지막 페이지에서는 댓글 접기로 변경
 * @param postId
 * @param firstCommentBundle
 * @constructor
 */
export default function PostComment({
    firstCommentBundle,
}: {
    firstCommentBundle: SpringCommentResponse;
}) {
    const initialComments = firstCommentBundle.content;
    return (
        <div>
            {/*댓글 헤더*/}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {firstCommentBundle?.totalElements}
            </h2>
            {!!firstCommentBundle && initialComments.length > 0 ? (
                initialComments.map((set, setIndex) => (
                    <CommentBundle key={setIndex} bundle={set} />
                ))
            ) : (
                <div>댓글없음</div>
            )}
        </div>
    );
}
