'use client';

import ReviewRating from '@/components/detail/ReviewRating';
import useFetchReivedReview from '@/hooks/fetch/useFetchReivedReview';
import Image from 'next/image';
import { toast } from 'sonner';

import NoContentGuide from './NoContentGuide';

export default function ReceivedReview({ kakaoId }: { kakaoId: number }) {
    const { receivedReview, totalRecieved } = useFetchReivedReview(kakaoId);

    if (totalRecieved === 0) {
        return <NoContentGuide />;
    }

    return (
        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2">
            {receivedReview.map((review, idx) => {
                const imageMatch = review.content.match(
                    /IMAGE:(https?:\/\/[^\s]+)/,
                );
                const imageUrl = imageMatch?.[1] || null;
                const cleanContent = review.content
                    .replace(/IMAGE:(https?:\/\/[^\s]+)/, '')
                    .trim();
                return (
                    <div
                        key={`received-${idx}`}
                        className="flex flex-col rounded-lg border-none bg-[#f5f6f7]"
                    >
                        <div className="flex flex-col items-start gap-5 p-[30px]">
                            <ReviewRating rating={review.rating} />

                            {/* 게시글 썸네일이 있는 경우 표시, 아닌 경우 텍스트로 채움 */}
                            <div className="flex min-h-[98px] w-full items-start gap-5">
                                {imageUrl ? (
                                    <>
                                        <div className="relative h-[98px] w-[98px] overflow-hidden rounded-lg">
                                            <Image
                                                src={imageUrl}
                                                alt="Travel photo"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-base leading-6 font-medium text-[#333333]">
                                            {cleanContent}
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
                                        <Image
                                            src={review.writer.thumbnailUrl}
                                            alt="user profile"
                                            width={24}
                                            height={24}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="inline-flex items-center gap-2.5">
                                        <div className="text-sm font-medium text-[#333333]">
                                            {review.writer.nickname}
                                        </div>

                                        <div className="h-2.5 w-px bg-gray-300"></div>

                                        <div className="max-w-full truncate text-xs font-normal text-[#666666]">
                                            {/* new Date() 형식 변환 */}{' '}
                                            {review.createdAt}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        toast('신고 완료', {
                                            description:
                                                '신고가 성공적으로 접수되었습니다.',
                                        });
                                    }}
                                    className="max-w-[80px] cursor-pointer truncate text-xs font-normal text-[#999999]"
                                >
                                    신고하기
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
