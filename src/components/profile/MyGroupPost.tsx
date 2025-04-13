'use client';

import Divider from '@/components/common/Divider';
import UserChat from '@/components/common/userChat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import useCancelApply from '@/hooks/fetch/useCancelApply';
import { MyJoin } from '@/hooks/fetch/useFetchMyJoin';
import { calculateDays } from '@/lib/calculateDays';
import { ageLabelMap, genderLabelMap } from '@/lib/utils/enumMapper';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import NoContentGuide from './NoContentGuide';
import ReviewEditor from './ReviewEditor';

interface MyGroupPostProps {
    posts: MyJoin[];
    cancelRecruit?: boolean;
}

// 게시글 삭제 여부 임시
const isDeleted = false;

// 날짜 계산 관련
const now = new Date();

export default function MyGroupPost({
    posts,
    cancelRecruit,
}: MyGroupPostProps) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    // 버튼 클릭시 모든 채팅 창이 열리는 버그 수정
    const toggleChat = (postId: number) => {
        setActiveChatId((current) => (current === postId ? null : postId));
    };

    // --------------동행 참여 취소 관련--------------
    const { cancelApply, isLoading } = useCancelApply();

    const handleCancelJoin = (gatheringId: number) => {
        cancelApply(gatheringId);
    };
    // -------------------------------------------

    if (posts.length === 0) return <NoContentGuide />;

    return (
        <div className="flex w-full flex-col gap-5">
            {posts.map((post) => (
                <div
                    key={post.gatheringId}
                    className="relative overflow-visible rounded-xl border-none bg-[#f5f6f7] p-[30px] shadow-none"
                >
                    {/* 게시글 */}
                    <div className="flex w-full items-center gap-5">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
                            <Image
                                className="object-cover"
                                alt={post.title}
                                src={post.thumbnailUrl}
                                fill
                                sizes="80px"
                            />
                        </div>
                        <div className="flex flex-grow flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        new Date(post.endAt) > now
                                            ? 'default'
                                            : 'disable'
                                    }
                                >
                                    {new Date(post.endAt) > now
                                        ? '모집 중'
                                        : '모집 마감'}
                                </Badge>

                                <h3 className="text-lg font-semibold text-black">
                                    {post.title}
                                </h3>
                            </div>

                            {/* 모임 세부 정보 */}
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                {post.startAt} - {post.endAt} (
                                {calculateDays(post.startAt, post.endAt)}일)
                                <Divider />
                                {ageLabelMap[post.preferredAge] ||
                                    post.preferredAge}
                                <Divider />
                                {genderLabelMap[post.preferredGender] ||
                                    post.preferredGender}
                                <Divider />
                                <span>
                                    <span
                                        // 모집 인원이 다 찼을 때 black으로 글자 색상 처리
                                        className={
                                            post.currentParticipants ===
                                            post.maxParticipants
                                                ? ''
                                                : 'text-[#666666]'
                                        }
                                    >
                                        {post.currentParticipants}명 /{' '}
                                    </span>
                                    {post.maxParticipants}명
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <div className="relative h-5 w-5">
                                    <Image
                                        src={post.host.thumbnailUrl}
                                        width={20}
                                        height={20}
                                        alt="유저 아이콘 이미지"
                                    />
                                </div>
                                {post.host.nickname}
                            </div>
                        </div>

                        <div className="flex w-[130px] flex-shrink-0 flex-col items-center gap-2">
                            {/* 문의 버튼과 채팅창 모달 */}
                            <Button
                                variant={'skyblueOutline'}
                                onClick={() => toggleChat(post.gatheringId)}
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

                            <Sheet
                                open={activeChatId === post.gatheringId}
                                onOpenChange={() =>
                                    toggleChat(post.gatheringId)
                                }
                            >
                                <SheetContent
                                    side="right"
                                    className="p-0 sm:max-w-[580px]"
                                >
                                    <UserChat
                                        userName={post.host.nickname}
                                        userRating={4.5} //todo: 이건 추가로 불러와야 할 것 같습니다.
                                        title={post.title}
                                        startDate={post.startAt}
                                        endDate={post.endAt}
                                        onClose={() =>
                                            toggleChat(post.gatheringId)
                                        }
                                    />
                                </SheetContent>
                            </Sheet>

                            {/* 참여 중인 동행 탭에서 보일 내용 */}
                            {cancelRecruit && (
                                <Button
                                    type="button"
                                    variant={'outline'}
                                    onClick={() =>
                                        handleCancelJoin(post.gatheringId)
                                    }
                                    className="flex w-[130px] text-[#666666]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin text-neutral-400" />
                                    ) : (
                                        '취소하기'
                                    )}
                                </Button>
                            )}

                            {/* 소감 남기기 버튼과 소감 작성 모달 */}
                            {!cancelRecruit && (
                                <>
                                    <Button
                                        onClick={() => setIsEditorOpen(true)}
                                        className="w-full"
                                    >
                                        소감 남기기
                                    </Button>
                                    <ReviewEditor
                                        open={isEditorOpen}
                                        onOpenChange={setIsEditorOpen}
                                    />
                                </>
                            )}
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
        </div>
    );
}
