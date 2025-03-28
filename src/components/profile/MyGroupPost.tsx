import Divider from '@/components/common/Divider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PostContentProps } from '@/types/PostContent';
import Image from 'next/image';

interface MyGroupPostProps {
    posts: PostContentProps['post'][];
}

// 게시글 삭제 여부 임시
const isDeleted = true;

export default function MyGroupPost({ posts }: MyGroupPostProps) {
    return (
        <article className="flex w-full flex-col gap-5">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="relative overflow-visible rounded-xl border-none bg-[#f5f6f7] p-[30px] shadow-none"
                >
                    {/* 게시글 */}
                    <div className="flex w-full items-center gap-5">
                        <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                                className="rounded-lg object-cover"
                                alt={post.title}
                                src={post.imageSrc}
                                fill
                                sizes="80px"
                            />
                        </div>
                        <div className="flex flex-grow flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        post.isGroupOpen ? 'default' : 'disable'
                                    }
                                >
                                    {post.isGroupOpen ? '모집 중' : '모집 마감'}
                                </Badge>

                                <h3 className="text-lg font-semibold text-black">
                                    {post.title}
                                </h3>
                            </div>

                            {/* 모임 세부 정보 */}
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                {post.startDate} - {post.endDate} ({'n'}일)
                                <Divider />
                                {post.age}
                                <Divider />
                                {post.preferredGender}
                                <Divider />
                                <span>
                                    <span
                                        // 모집 인원이 다 찼을 때 black으로 글자 색상 처리
                                        className={
                                            post.currentMembers ===
                                            post.maxMembers
                                                ? ''
                                                : 'text-[#666666]'
                                        }
                                    >
                                        {post.currentMembers}명 /{' '}
                                    </span>
                                    {post.maxMembers}명
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <div className="relative h-5 w-5">
                                    <Image
                                        src={post.profileImage}
                                        width={20}
                                        height={20}
                                        alt="유저 아이콘 이미지"
                                    />
                                </div>
                                {post.userName}
                            </div>
                        </div>

                        <div className="flex w-[130px] flex-shrink-0 flex-col items-center gap-2">
                            <Button
                                variant={'skyblueOutline'}
                                className="w-full"
                            >
                                <Image
                                    src="/icon/detail/chatIcon.svg"
                                    alt="chat"
                                    width={16}
                                    height={16}
                                    className="mr-1.5"
                                />
                                문의하기
                            </Button>
                            <Button className="w-full">소감 남기기</Button>
                        </div>
                    </div>

                    {/* 게시글이 삭제(숨김)처리된 경우 */}
                    {/* 나중에 key 추가하여 post.isDeleted 로 게시글 삭제 여부 처리 */}
                    {isDeleted && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#000000b2]">
                            {/* TODO 누르면 사용자에게 해당 게시물이 안 보이게 처리 */}
                            <button className="absolute top-5 right-5 text-white">
                                <Image
                                    src={'/icon/profile/closeIcon.svg'}
                                    alt="closing button"
                                    width={15}
                                    height={15}
                                />
                            </button>
                            <p className="text-center text-sm font-medium text-white">
                                주최자가 동행을 삭제 or 비공개했어요
                                <br />
                                다른 동행에 참여해 보세요! 🙏
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </article>
    );
}
