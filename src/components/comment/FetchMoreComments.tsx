'use client';

import CommentBundle, { Comment } from '@/components/comment/CommentBundle';
import { fetchComments } from '@/lib/fetcher/fetchComments';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

/** #P101 성능: 불필요한 리렌더링 방지를 위해 React.memo 적용 검토 필요 */
export default function FetchMoreComments({ postId }: { postId: number }) {
    /** #T102 타입 안정성: 상태 관리에 대한 타입 명시적 정의 필요 */
    const [fetchedComments, setFetchedComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [isFolded, setIsFolded] = useState(false);
    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /** #E103 에러처리: 댓글 로딩 실패 시 에러 처리 및 재시도 기능 필요 */
    const handleLoadMore = async () => {
        setIsLoading(true);
        const result = await fetchComments(postId, page);
        setFetchedComments((prev) => [...prev, ...result.content]);
        setPage((prev) => prev + 1);
        setIsLoading(false);
        if (result.last) {
            setIsAllLoaded(true);
            setIsFolded(false);
        }
    };

    /** #P104 성능: 상태 업데이트 로직 최적화를 위해 useReducer 사용 검토 필요 */
    const toggleFold = () => {
        setIsFolded((prev) => !prev);
    };

    /** #A105 접근성: 버튼에 대한 ARIA 레이블과 역할 추가 필요 */
    return (
        <div>
            {/* SSR 이후 댓글만 접기/펼치기 */}
            {fetchedComments.length > 0 &&
                !isFolded &&
                /** #P106 성능: 긴 목록의 경우 가상화 적용 검토 필요 */
                fetchedComments.map((comment) => (
                    <CommentBundle
                        key={comment.id}
                        bundle={comment}
                        postId={postId}
                    />
                ))}

            {/* 버튼 조건부 렌더링 */}
            {!isAllLoaded ? (
                /** #U107 사용자 경험: 로딩 상태에 대한 시각적 피드백 개선 필요 */
                <button
                    onClick={handleLoadMore}
                    className="mx-auto my-12.5 flex h-12 w-fit cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#f5f6f7] px-5 py-0 text-[#666666]"
                >
                    <p className="text-base leading-normal font-semibold whitespace-nowrap">
                        {isLoading ? (
                            <Loader2 className="text-sky-blue animate-spin" />
                        ) : (
                            '댓글 더보기'
                        )}
                    </p>
                    {!isLoading && <ChevronDown />}
                </button>
            ) : (
                /** #U108 사용자 경험: 버튼에 호버/포커스 상태 스타일 추가 필요 */
                <button
                    onClick={toggleFold}
                    className="mx-auto my-12.5 flex h-12 w-fit cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#f5f6f7] px-5 py-0 text-[#666666]"
                >
                    <p className="text-base leading-normal font-semibold whitespace-nowrap">
                        {isFolded ? '댓글 펼치기' : '댓글 접기'}
                    </p>
                    {isFolded ? <ChevronDown /> : <ChevronUp />}
                </button>
            )}
        </div>
    );
}
