import CommentBundle from '@/components/comment/CommentBundle';
import FetchMoreComments from '@/components/comment/FetchMoreComments';
import PostInput from '@/components/detail/PostInput';
import { SpringCommentResponse } from '@/lib/fetcher/fetchComments';

/**
 * 첫 페이지는 서버사이드 랜더링으로 불러와서 내려줍니다.
 * 이후 페이지는 더보기 버튼을 클릭시마다 fetch 해서 불러오고, 마지막 페이지에서는 댓글 접기로 변경
 * @param postId
 * @param firstCommentBundle
 * @constructor
 * 
 * #T101 타입 안정성: firstCommentBundle 널 체크 강화 필요
 */
export default function PostComment({
    firstCommentBundle,
    postId,
}: {
    firstCommentBundle: SpringCommentResponse;
    postId: number;
}) {
    /** #P102 성능: 불필요한 리렌더링 방지를 위해 useMemo 사용 검토 필요 */
    const initialComments = firstCommentBundle.content;

    /** #A103 접근성: 댓글 수를 스크린 리더에 적절히 전달하도록 개선 필요 */
    return (
        <div>
            {/*댓글 헤더*/}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {firstCommentBundle?.totalElements}
            </h2>
            {!!firstCommentBundle && initialComments.length > 0 ? (
                /** #P104 성능: 긴 목록의 경우 가상화 적용 검토 필요 */
                initialComments.map((set, setIndex) => (
                    <CommentBundle
                        key={setIndex}
                        bundle={set}
                        postId={postId}
                    />
                ))
            ) : (
                /** #U105 사용자 경험: 댓글이 없을 때 더 시각적으로 명확한 UI 필요 */
                <>
                    <div
                        className={
                            'flex min-h-30 items-center justify-center pb-3 text-center text-neutral-600'
                        }
                    >
                        아직 댓글이 없어요
                        <br /> 첫 댓글을 작성해 주세요
                    </div>
                    {/*글이 없는 경우 100% 신규 부모댓글 이므로 null , api 스펙이 null 명시되어 있습니다.*/}
                </>
            )}
            {/*SSR 결과가 마지막 페이지가 아니라면 실행*/}
            {/** #E106 에러처리: 댓글 로딩 실패 시 에러 처리 및 재시도 기능 필요 */}
            {!firstCommentBundle.last && <FetchMoreComments postId={postId} />}
            <PostInput postId={postId} parentId={null} variant={'Comment'} />
        </div>
    );
}
