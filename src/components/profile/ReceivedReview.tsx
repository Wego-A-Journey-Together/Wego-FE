import ReviewRating from '@/components/detail/ReviewRating';
import Image from 'next/image';
import React from 'react';

import { postReviews } from '../../../public/data/review';

export default function ReceivedReview() {
    // 리뷰가 없을 경우 표시할 컴포넌트 추가
    if (postReviews.length === 0) {
        return <></>;
    }

    return (
        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2">
            {postReviews.map((review) => (
                <div
                    key={review.reviewId}
                    className="flex flex-col rounded-lg border-none bg-[#f5f6f7]"
                >
                    <div className="flex flex-col items-start gap-5 p-[30px]">
                        <ReviewRating rating={review.rating} />

                        {/* 게시글 썸네일이 있는 경우 표시, 아닌 경우 텍스트로 채움 */}
                        <div className="flex min-h-[98px] w-full items-start gap-5">
                            {review.postImage ? (
                                <>
                                    <div className="relative h-[98px] w-[98px] overflow-hidden rounded-lg">
                                        <Image
                                            src={review.postImage}
                                            alt="Travel photo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 text-base leading-6 font-medium text-[#333333]">
                                        {review.content}
                                    </div>
                                </>
                            ) : (
                                <div className="text-base leading-6 font-medium text-[#333333]">
                                    {review.content}
                                </div>
                            )}
                        </div>

                        {/* 유저 정보 */}
                        <div className="mt-[45px] flex w-full items-center justify-between">
                            <div className="inline-flex items-center gap-1.5">
                                <div className="h-6 w-6 overflow-hidden rounded-full">
                                    <img
                                        src={review.userIcon}
                                        alt="user profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="inline-flex items-center gap-2.5">
                                    <div className="text-sm font-medium text-[#333333]">
                                        {review.userName}
                                    </div>

                                    <div className="h-2.5 w-px bg-gray-300"></div>

                                    <div className="max-w-full truncate text-xs font-normal text-[#666666]">
                                        {/* new Date() 형식 변환 */}
                                        {review.updatedAt?.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <button className="max-w-[80px] cursor-pointer truncate text-xs font-normal text-[#999999]">
                                신고하기
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
