'use client';

import FetchMoreReviews from '@/components/Review/FetchMoreReviews';
import ReviewRating from '@/components/detail/ReviewRating';
import { dateFormat } from '@/lib';
import { SpringReviewResponse } from '@/lib/fetcher/fetchReviews';
import Image from 'next/image';

export default function PostReview({
    firstReviewBundle,
    postId,
}: {
    firstReviewBundle: SpringReviewResponse;
    postId: number;
}) {
    const postReviews = firstReviewBundle.content;
    const totalReviews = firstReviewBundle.totalElements;

    return (
        <div className="mt-15">
            <h2 className="mb-7.5 text-xl font-bold text-neutral-950">
                소감 {totalReviews}
            </h2>

            {postReviews.map((review, idx) => {
                const lines = review.content.split('\n');
                const textLines: string[] = [];
                const imageUrls: string[] = [];

                lines.forEach((line) => {
                    if (line.startsWith('IMAGE:')) {
                        imageUrls.push(line.replace('IMAGE:', '').trim());
                    } else {
                        textLines.push(line);
                    }
                });

                const hasImage = imageUrls.length > 0;
                const textContent = textLines.join('\n');

                return (
                    <div key={`post-review-${idx}`}>
                        <ReviewRating rating={review.rating} />

                        <div
                            className={`mt-2.5 flex ${
                                hasImage
                                    ? 'flex-row items-start gap-4'
                                    : 'justify-end'
                            }`}
                        >
                            {hasImage && (
                                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md">
                                    <Image
                                        src={imageUrls[0]}
                                        alt="소감 이미지"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <p
                                className={`text-base font-medium whitespace-pre-wrap text-[#333333] ${
                                    hasImage ? '' : 'text-right'
                                }`}
                            >
                                {textContent}
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
                );
            })}

            {postReviews.length === 0 && (
                <div className="text-center text-neutral-600">
                    아직 작성된 소감이 없어요
                </div>
            )}

            {!firstReviewBundle.last && <FetchMoreReviews postId={postId} />}
        </div>
    );
}
