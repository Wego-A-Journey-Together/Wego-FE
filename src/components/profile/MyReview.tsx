import ReviewRating from '@/components/detail/ReviewRating';
import { Button } from '@/components/ui/button';
import { PostContentProps } from '@/types/PostContent';
import Image from 'next/image';

interface MyReviewProps {
    user: PostContentProps['post'];
}

export default function MyReview({ user }: MyReviewProps) {
    if (!user) return null;

    return (
        <article className="flex flex-col items-start gap-5 rounded-xl border-none bg-[#f5f6f7] px-[34px] py-[30px]">
            <div className="relative flex w-full items-start gap-5 space-y-0 border-b border-[#d9d9d9] px-0 pt-0 pb-5">
                <div className="flex w-full items-start gap-3">
                    <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                        <Image
                            className="h-full w-full object-cover"
                            alt="Profile"
                            src={user.profileImage}
                            width={60}
                            height={60}
                        />
                    </div>

                    <div className="flex flex-col items-start gap-1.5">
                        <h2 className="text-xs font-medium text-[#666666]">
                            {user.title}
                        </h2>

                        <h3 className="text-base font-bold text-[#333333]">
                            {user.userName}
                        </h3>

                        <div className="flex items-center gap-1">
                            <ul className="flex items-center gap-1.5">
                                <li className="text-xs font-normal text-[#666666]">
                                    {user.startDate} - {user.endDate} ({'n'}일)
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
                                    {user.ageRange}
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
                                    {user.preferredGender}
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
                                    {user.currentMembers}명 / {user.maxMembers}
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
                    <ReviewRating rating={user.rating} />

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
                            src={user.imageSrc}
                            fill
                            sizes="98px"
                        />
                    </div>

                    <p className="text-base leading-6 font-medium text-[#333333]">
                        긍정적인 에너지가 가득한 분이라 여행 내내 즐겁고
                        유쾌했어요! 다음에도 기회가 된다면 또 함께 여행하고
                        싶습니다.
                    </p>
                </figure>
            </section>
        </article>
    );
}
