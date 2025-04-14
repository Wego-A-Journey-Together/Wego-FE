'use client';

import ReviewRating from '@/components/detail/ReviewRating';
import { dateFormat } from '@/lib';
import type { ReviewItem } from '@/lib/fetcher/fetchReviews';
import { fetchReviews } from '@/lib/fetcher/fetchReviews';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function FetchMoreReviews({ postId }: { postId: number }) {
    const [fetchedReviews, setFetchedReviews] = useState<ReviewItem[]>([]);
    const [page, setPage] = useState(1); // SSR은 0페이지 사용했다고 가정
    const [isFolded, setIsFolded] = useState(false);
    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadMore = async () => {
        setIsLoading(true);
        const result = await fetchReviews(postId, page);
        setFetchedReviews((prev) => [...prev, ...result.content]);
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
            {fetchedReviews.length > 0 && !isFolded && (
                <div className="mt-10">
                    {fetchedReviews.map((review, idx) => (
                        <div key={`fetched-review-${idx}`} className="mb-5">
                            <ReviewRating rating={review.rating} />
                            <div className="mt-2.5">
                                <p className="text-base font-medium text-[#333333]">
                                    {review.content}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center gap-3">
                                <div className="relative aspect-square h-6 w-6">
                                    <Image
                                        src={review.writer.thumbnailUrl}
                                        alt="유저 프로필 이미지"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="text-sm font-semibold text-black">
                                        {review.writer.nickname}
                                    </div>
                                    <div className="h-2.5 w-px bg-[#a0a0a0]" />
                                    <p className="text-xs font-normal text-[#666666]">
                                        {dateFormat(review.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="my-5 h-px w-12 bg-[#e9e9e9]" />
                        </div>
                    ))}
                </div>
            )}

            {!isAllLoaded ? (
                <button
                    onClick={handleLoadMore}
                    className="mx-auto my-12.5 flex h-12 w-fit cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#f5f6f7] px-5 py-0 text-[#666666]"
                >
                    <p className="text-base leading-normal font-semibold whitespace-nowrap">
                        {isLoading ? (
                            <Loader2 className="text-sky-blue animate-spin" />
                        ) : (
                            '소감 더보기'
                        )}
                    </p>
                    {!isLoading && <ChevronDown />}
                </button>
            ) : (
                fetchedReviews.length > 0 && (
                    <button
                        onClick={toggleFold}
                        className="mx-auto my-12.5 flex h-12 w-fit cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#f5f6f7] px-5 py-0 text-[#666666]"
                    >
                        <p className="text-base leading-normal font-semibold whitespace-nowrap">
                            {isFolded ? '소감 펼치기' : '소감 접기'}
                        </p>
                        {isFolded ? <ChevronDown /> : <ChevronUp />}
                    </button>
                )
            )}
        </div>
    );
}
