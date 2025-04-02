import ReviewRating from '@/components/detail/ReviewRating';
import { dateFormat } from '@/lib';
import Image from 'next/image';

import { postReviews } from '../../../public/data/review';

export default function PostReview() {
    const totalReviews = postReviews.length;
    return (
        <div className="mt-15">
            {/*리뷰 헤더*/}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                리뷰 {totalReviews}
            </h2>

            {/*리뷰 섹션*/}
            {postReviews.map((review, idx) => (
                <div key={`post-review-${idx}`}>
                    {/*별점 섹션*/}
                    <ReviewRating rating={review.rating} />
                    {/*리뷰 본문 */}
                    <div className={`mt-2.5`}>
                        <p className={`text-base font-medium text-[#333333]`}>
                            {review.content}
                        </p>
                    </div>

                    {/*유저 정보 섹션*/}
                    <div className="mt-2.5 flex items-center gap-3">
                        {/*유저 이미지*/}
                        <div className="relative aspect-square h-6 w-6">
                            <Image
                                src={review.userIcon}
                                alt="유저 프로필 이미지"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>

                        {/* 유저 이름 및 날짜 */}
                        <div className="flex items-center gap-2.5">
                            <div className="text-sm font-semibold text-black">
                                {review.userName}
                            </div>
                            {/*세퍼레이터*/}
                            <div className="h-2.5 w-px bg-[#a0a0a0]" />
                            {/*날짜 섹션*/}
                            <p className={`text-xs font-normal text-[#666666]`}>
                                {dateFormat(review.updatedAt)}
                            </p>
                        </div>
                    </div>

                    {/*리뷰 세퍼레이터*/}
                    <div className="my-5 h-px w-12 bg-[#e9e9e9]" />
                </div>
            ))}
        </div>
    );
}
