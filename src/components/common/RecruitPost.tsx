import Like from '@/components/Btn/Like';
import { dateFormat, extractPreview } from '@/lib';
import { calculateDays } from '@/lib/calculateDays';
import { BEHomePost } from '@/types/BEHomePost';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '../ui/badge';

//todo : 현재는 낙관적 업데이트를 위한 단순한 id 만 정의 (데이터 바인딩 x )

export interface PostContentProps {
    post: BEHomePost;
}

export default function RecruitPost({ post }: PostContentProps) {
    const isGroupOpen = new Date(post.closedAt) > new Date();

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
                            {post.startAt && post.endAt
                                ? `${dateFormat(post.startAt, false)} - ${dateFormat(post.endAt, false)} (${calculateDays(post.startAt, post.endAt)}일)`
                                : '날짜 미정'}
                        </span>
                        <div className="h-1.5 w-px bg-gray-300" />
                        <span className="text-sm text-[#333333]">
                            {post.preferredAge}
                        </span>
                        <div className="h-1.5 w-px bg-gray-300" />
                        <span className="text-sm text-[#333333]">
                            {post.preferredGender}
                        </span>
                        <div className="h-1.5 w-px bg-gray-300" />
                        <span>
                            <span className="text-sm text-[#999999]">
                                {/*todo: 백엔드 api에 참여중인 사람 수는 안나오는 것 같습니다. */}
                                1
                            </span>
                            <span className="text-sm text-[#333333]">
                                / {post.maxParticipants}
                            </span>
                        </span>
                    </div>

                    {/* 해시태그 리스트 */}
                    <ul className="mb-[22px] flex items-center gap-2">
                        {post.hashtags.length > 0 ? (
                            post.hashtags.map((hashtag, index) => (
                                <li
                                    key={index}
                                    className="relative rounded px-1.5 py-1"
                                >
                                    <div className="text-sky-blue z-10 text-[15px] leading-[19.1px] font-medium tracking-[0.47px] whitespace-nowrap">
                                        #{hashtag}
                                    </div>
                                    <div className="bg-sky-blue absolute top-0 left-0 h-[27px] w-full rounded opacity-[0.08]" />
                                </li>
                            ))
                        ) : (
                            <li className="invisible text-sm text-[#999]">
                                공간차지
                            </li>
                        )}
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
                {/*todo: 포스트 조회에 주최자 아이디가 없어서 일단 닉네임으로 대체해 두겠습니다.*/}
                <Link href={`/profile/${post.creator.nickname}`}>
                    {/* 아이콘 */}
                    <div className="flex items-center gap-3">
                        <div className="h-[42px] w-[42px] overflow-hidden rounded-full">
                            <Image
                                src={post.creator.thumbnailUrl}
                                alt="유저 프로필 이미지"
                                width={42}
                                height={42}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* 유저 정보 */}
                        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                            <div className="text-base font-semibold text-black">
                                {post.creator.nickname}
                            </div>
                            <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                                <span className="text-xs text-[#666666]">
                                    {post.creator.statusMessage}
                                </span>
                                <div className="h-1.5 w-px bg-gray-300" />
                                <span className="text-xs text-[#666666]">
                                    {/*todo: 작성자 나이를 그룹으로 가져오고 있는데 이후에 숫자 업로드 구현후 보고 정하면 좋을 것 같습니다.*/}
                                    {/*{convertAgeRange(post.creator.age)}*/}
                                    {post.creator.ageGroup}
                                </span>
                                <div className="h-1.5 w-px bg-gray-300" />
                                <span className="text-xs text-[#666666]">
                                    {post.creator.gender}
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
