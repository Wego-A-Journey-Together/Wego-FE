'use client';

import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, MoreHorizontal, Star } from 'lucide-react';

import ChatNotice from './ChatNotice';
import ChatRoom from './ChatRoom';

interface ChatPageViewProps {
    userName: string;
    userRating: number;
    title: string;
    startDate: string;
    endDate: string;
    onClose?: () => void;
    onParticipate?: () => void;
    roomId?: number;
}

export default function ChatPageView({
    userName,
    userRating,
    title,
    startDate,
    endDate,
    onClose,
    onParticipate,
    roomId,
}: ChatPageViewProps) {
    return (
        <div className="bg-background-light flex h-full w-full flex-col border-x-1 border-[#E9E9E9]">
            {/* 채팅창 헤더 */}
            <header className="flex h-[72px] w-full flex-row items-center justify-between border-b px-5 py-2.5">
                <button
                    className="flex h-6 w-6 cursor-pointer items-center justify-center"
                    onClick={onClose}
                    aria-label="뒤로 가기"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="inline-flex items-center gap-1">
                    {/* 유저 아이디 */}
                    <h2 className="m-0 text-[15px] font-semibold text-black">
                        {userName}
                    </h2>

                    <div className="inline-flex items-center gap-1 rounded-[50px] bg-[#ffd8001a] px-2 py-1 text-[#614e03]">
                        <Star className="h-4 w-4 fill-[#FFD800] text-[#FFD800]" />

                        {/* 유저 평점 */}
                        <span className="text-xs font-medium">
                            {userRating}
                        </span>
                    </div>
                </div>

                <button
                    className="flex h-6 w-6 items-center justify-center"
                    aria-label="MoreHorizontal options"
                >
                    <MoreHorizontal className="h-5 w-5 cursor-pointer text-[#333333]" />
                </button>
            </header>

            {/* 게시글 제목, 상태, 참여하기 버튼 섹션 */}
            <section className="flex w-full flex-col gap-2.5 border-b px-5 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 flex-col gap-[3px] pr-2">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <p className="m-0 text-sm font-normal whitespace-nowrap text-[#666666]">
                                {`${startDate} - ${endDate}`}
                            </p>
                        </div>
                    </div>

                    <Button className="px-[30px] py-2" onClick={onParticipate}>
                        참여하기
                    </Button>
                </div>
            </section>

            {/* 채팅 말풍선 섹션 */}
            <section className="w-full flex-1 overflow-y-auto p-4">
                {roomId ? <ChatRoom roomId={roomId} /> : <ChatNotice />}
            </section>
        </div>
    );
}
