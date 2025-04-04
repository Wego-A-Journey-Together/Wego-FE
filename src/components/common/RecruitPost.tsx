import Like from '@/components/Btn/Like';
import { dateFormat, extractPreview } from '@/lib';
import { calculateDays } from '@/lib/calculateDays';
import { convertAgeRange } from '@/lib/convertAgeRange';
import { HomePost } from '@/types/HomePost';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '../ui/badge';

//todo : 현재는 낙관적 업데이트를 위한 단순한 id 만 정의 (데이터 바인딩 x )

export interface PostContentProps {
    post: HomePost;
}

export default function RecruitPost({ post }: PostContentProps) {
    const isGroupOpen = new Date(post.filter.deadlineDate) > new Date();

    return (
        <article className="flex flex-col gap-2.5 rounded-xl bg-[#f5f6f7] px-[34px] py-[30px]">
            {/* 헤더 섹션 */}
            <div className="flex w-full flex-col">
                <Link href={`/detail/${post.id}`}>
                    <div className="relative">
                        <div className="mb-1.5 flex w-full items-center gap-2">
                            <Badge
                                variant={isGroupOpen ? 'default' : 'disable'}
                            >
                                {isGroupOpen ? '동행 구함' : '모집 마감'}
                            </Badge>

                            {/* 글제목  */}
                            <h1 className="flex-1 truncate overflow-hidden text-xl font-bold text-black">
                                {post.title}
                            </h1>
                        </div>

                        {/* 썸네일 이미지 */}
                        {post.thumbnailUrl && (
                            <div className="absolute top-0 right-0 h-[98px] w-[98px] overflow-hidden rounded-xl">
                                <Image
                                    src={post.thumbnailUrl}
                                    alt="게시글 썸네일"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* 모집 정보 */}
                    <div className="mb-3 flex items-center gap-2.5">
                        <span className="text-sm text-[#333333]">
                            {post.filter?.startDate && post.filter?.endDate
                                ? `${dateFormat(post.filter.startDate, false)} - ${dateFormat(post.filter.endDate, false)} (${calculateDays(post.filter.startDate, post.filter.endDate)}일)`
                                : '날짜 미정'}
                        </span>
                        <div className="h-1.5 w-px bg-gray-300" />
                        <span className="text-sm text-[#333333]">
                            {post.filter.age}
                        </span>
                        <div className="h-1.5 w-px bg-gray-300" />
                        <span className="text-sm text-[#333333]">
                            {post.filter.gender}
                        </span>
                        <div className="h-1.5 w-px bg-gray-300" />
                        <span>
                            <span className="text-sm text-[#999999]">
                                {post.currentMembers}{' '}
                            </span>
                            <span className="text-sm text-[#333333]">
                                / {post.maxMembers}
                            </span>
                        </span>
                    </div>

                    {/* 해시태그 리스트 */}
                    <ul className="mb-[22px] flex items-center gap-2">
                        {post.tags.map((hashtag, index) => (
                            <li
                                key={index}
                                className="relative rounded px-1.5 py-1"
                            >
                                <div className="text-sky-blue z-10 text-[15px] leading-[19.1px] font-medium tracking-[0.47px] whitespace-nowrap">
                                    {hashtag}
                                </div>
                                <div className="bg-sky-blue absolute top-0 left-0 h-[27px] w-full rounded opacity-[0.08]" />
                            </li>
                        ))}
                    </ul>

                    {/* 본문 미리보기 */}
                    <p className="mb-3.5 h-[62px] w-full overflow-hidden text-base leading-[20.8px] font-normal text-[#333333]">
                        {extractPreview(post.content)}
                    </p>
                </Link>
            </div>

            <hr className="mb-3.5 h-px w-full border-0 bg-gray-200" />

            {/* 유저 프로필 */}
            <div className="flex w-full flex-row items-start justify-between md:items-center">
                <Link href={`/profile/${post.userId}`}>
                    {/* 아이콘 */}
                    <div className="flex items-center gap-3">
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                            <Image
                                src={post.profileImage}
                                alt="유저 프로필 이미지"
                                width={50}
                                height={50}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* 유저 정보 */}
                        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                            <div className="text-base font-semibold text-black">
                                {post.userName}
                            </div>
                            <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                                <span className="text-xs text-[#666666]">
                                    {post.statusMessage}
                                </span>
                                <div className="h-1.5 w-px bg-gray-300" />
                                <span className="text-xs text-[#666666]">
                                    {convertAgeRange(post.userAge)}
                                </span>
                                <div className="h-1.5 w-px bg-gray-300" />
                                <span className="text-xs text-[#666666]">
                                    {post.gender}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/*todo : 낙관적 업데이트 찜 버튼*/}
                <div className="flex items-center gap-2 md:w-auto">
                    <Like id={post.id} className={`px-0`} />
                </div>
            </div>
        </article>
    );
}
