'use client';

import ReviewRating from '@/components/detail/ReviewRating';
import { Button } from '@/components/ui/button';
import { useFetchPostedReview } from '@/hooks/fetch/useFetchPostedReveiw';
import Image from 'next/image';

import NoContentGuide from './NoContentGuide';

export default function MyReview() {
    const { postedReview, isLoading } = useFetchPostedReview();

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!postedReview || postedReview.length === 0) {
        return <NoContentGuide />;
    }

    return (
        <div className="flex flex-col gap-6">
            {postedReview.map((review, index) => {
                // 날짜 차이 계산 (n일)
                const startDate = new Date(review.gathering.startAt);
                const endDate = new Date(review.gathering.endAt);
                const diffDays = Math.ceil(
                    (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                );

                return (
                    <article
                        key={`review-${index}`}
                        className="flex flex-col items-start gap-5 rounded-xl border-none bg-[#f5f6f7] px-[34px] py-[30px]"
                    >
                        <div className="relative flex w-full items-start gap-5 space-y-0 border-b border-[#d9d9d9] px-0 pt-0 pb-5">
                            <div className="flex w-full items-start gap-3">
                                <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                                    <Image
                                        className="h-full w-full object-cover"
                                        alt="Profile"
                                        src={
                                            review.gathering.host
                                                .thumbnailUrl ||
                                            '/image/userIcon.png'
                                        }
                                        width={60}
                                        height={60}
                                    />
                                </div>

                                <div className="flex flex-col items-start gap-1.5">
                                    <h2 className="text-xs font-medium text-[#666666]">
                                        {review.gathering.title}
                                    </h2>

                                    <h3 className="text-base font-bold text-[#333333]">
                                        {review.gathering.host.nickname}
                                    </h3>

                                    <div className="flex items-center gap-1">
                                        <ul className="flex items-center gap-1.5">
                                            <li className="text-xs font-normal text-[#666666]">
                                                {review.gathering.startAt} -{' '}
                                                {review.gathering.endAt} (
                                                {diffDays}일)
                                            </li>

                                            <li className="flex items-center">
                                                <Image
                                                    className="h-1 w-px"
                                                    alt="Line"
                                                    src="/line-22.svg"
                                                    width={1}
                                                    height={1}
                                                />
                                            </li>

                                            <li className="text-xs font-normal text-[#666666]">
                                                {review.gathering.preferredAge}
                                            </li>

                                            <li className="flex items-center">
                                                <Image
                                                    className="h-1 w-px"
                                                    alt="Line"
                                                    src="/line-22.svg"
                                                    width={1}
                                                    height={1}
                                                />
                                            </li>

                                            <li className="text-xs font-normal text-[#666666]">
                                                {
                                                    review.gathering
                                                        .preferredGender
                                                }
                                            </li>

                                            <li className="flex items-center">
                                                <Image
                                                    className="h-1 w-px"
                                                    alt="Line"
                                                    src="/line-22.svg"
                                                    width={1}
                                                    height={1}
                                                />
                                            </li>

                                            <li className="text-xs font-normal text-[#666666]">
                                                {
                                                    review.gathering
                                                        .currentParticipants
                                                }
                                                명 /{' '}
                                                {
                                                    review.gathering
                                                        .maxParticipants
                                                }
                                                명
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="absolute top-0 right-0 h-[15px] w-[15px]"
                                aria-label="Close review"
                            >
                                <Image
                                    src={'/icon/profile/closeIcon.svg'}
                                    alt="closing button"
                                    width={15}
                                    height={15}
                                />
                            </button>
                        </div>

                        <section className="flex w-full flex-col items-start gap-5 p-0">
                            <div className="flex w-full items-start justify-between">
                                <ReviewRating rating={review.rating} />

                                <Button
                                    variant="outline"
                                    className="h-auto rounded-md border-[#d9d9d9] px-5 py-1.5"
                                >
                                    <span className="text-xs font-medium text-[#333333]">
                                        수정
                                    </span>
                                </Button>
                            </div>

                            <figure className="flex w-full items-start gap-5">
                                <div className="relative h-[98px] w-[98px] flex-shrink-0">
                                    <Image
                                        className="rounded-lg object-cover"
                                        alt="Review image"
                                        src={
                                            review.gathering.thumbnailUrl ||
                                            '/image/userIcon.png'
                                        }
                                        fill
                                        sizes="98px"
                                    />
                                </div>

                                <p className="text-base leading-6 font-medium text-[#333333]">
                                    {review.content}
                                </p>
                            </figure>
                        </section>
                    </article>
                );
            })}
        </div>
    );
}
