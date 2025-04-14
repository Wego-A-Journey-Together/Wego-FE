import { dateFormat } from '@/lib';
import { calculateDays } from '@/lib/calculateDays';
import { DetailPost } from '@/types/DetailPost';
import Image from 'next/image';

import JsonToHtmlWrapper from './JsonToHtmlWrapper';

export default function PostContent({ post }: { post: DetailPost }) {
    return (
        <>
            <div className="mt-12.5 mb-[60px] flex flex-col items-start gap-[30px]">
                <div className="w-full">
                    <h2 className="text-xl font-bold text-black">동행 정보</h2>
                </div>

                <div className="w-full">
                    <article className="w-full rounded-xl bg-[#f5f6f7] p-5">
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex w-32 items-center gap-4">
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <Image
                                            src="/icon/home/pinIcon.svg"
                                            alt="동행지"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">
                                        동행지
                                    </h3>
                                </div>
                                <p className="text-base font-medium">
                                    {post.location.placeName}
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="flex w-32 items-center gap-4">
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <Image
                                            src="/icon/home/calenderIcon.svg"
                                            alt="날짜"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">
                                        날짜
                                    </h3>
                                </div>
                                <div className="text-base font-medium">
                                    {dateFormat(post.filter.startDate, false)} -{' '}
                                    {dateFormat(post.filter.endDate, false)} (
                                    {calculateDays(
                                        post.filter.startDate,
                                        post.filter.endDate,
                                    )}
                                    일)
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="flex w-32 items-center gap-4">
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <Image
                                            src="/icon/home/groupIcon.svg"
                                            alt="동행 테마"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">
                                        동행 테마
                                    </h3>
                                </div>
                                <div className="text-base font-medium">
                                    {post.filter.groupTheme}
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="flex w-32 items-center gap-4">
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <Image
                                            src="/icon/home/openedBookIcon.svg"
                                            alt="인원"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">
                                        인원
                                    </h3>
                                </div>
                                <div className="text-base font-medium">
                                    <span className="text-[#999999]">
                                        {post.currentMembers}{' '}
                                    </span>
                                    <span className="text-[#333333]">
                                        / {post.maxMembers} 명
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="flex w-32 items-center gap-4">
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <Image
                                            src="/icon/home/smileIcon.svg"
                                            alt="선호 정보"
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">
                                        선호 정보
                                    </h3>
                                </div>
                                <div className="text-base font-medium">
                                    <div className="inline-flex items-center gap-[18px]">
                                        <span className="text-[#333333]">
                                            {post.filter.age[0]}
                                        </span>
                                        <div className="h-2.5 w-px bg-gray-300" />
                                        <span className="text-[#333333]">
                                            {post.filter.gender}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    <div className="mt-5 flex flex-col gap-5">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="rounded bg-[#00afc9]/[0.08] px-1.5 py-1 text-[15px] text-[#00afc9]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <article className="text-lg leading-[130%] font-medium text-[#333333]">
                            <JsonToHtmlWrapper content={post.content} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
