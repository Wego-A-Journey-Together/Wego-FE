'use client';

import CommentBundle, { Comment } from '@/components/comment/CommentBundle';
import { fetchComments } from '@/lib/fetcher/fetchComments';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function FetchMoreComments({ postId }: { postId: number }) {
    const [fetchedComments, setFetchedComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [isFolded, setIsFolded] = useState(false);
    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const toggleFold = () => {
        setIsFolded((prev) => !prev);
    };

    return (
        <div>
            {/* SSR 이후 댓글만 접기/펼치기 */}
            {fetchedComments.length > 0 &&
                !isFolded &&
                fetchedComments.map((comment) => (
                    <CommentBundle
                        key={comment.id}
                        bundle={comment}
                        postId={postId}
                    />
                ))}

            {/* 버튼 조건부 렌더링 */}
            {!isAllLoaded ? (
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
