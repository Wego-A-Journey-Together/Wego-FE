'use client';

import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, MoreHorizontal, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    kakaoId?: string;
}

interface RoomData {
    roomId: number;
    opponentNickname: string;
    opponentRating: number;
    lastMessage: string;
    unreadCount: number;

    gathering?: {
        title: string;
        startDate: string;
        endDate: string;
    };
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
    kakaoId,
}: ChatPageViewProps) {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    const userKakaoId = kakaoId || (params.kakaoId as string);
    const roomIdValue = roomId || parseInt(params.roomId as string, 10);

    useEffect(() => {
        if (!roomIdValue) return;

        const fetchRoomData = async () => {
            try {
                setLoading(true);
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL ||
                    'http://localhost:3000';
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomIdValue}`,
                    {
                        credentials: 'include',
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch room data: ${response.status}`,
                    );
                }

                const data = await response.json();
                setRoomData(data);
            } catch (err) {
                console.error('Error fetching room data:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [roomIdValue]);

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
                        {roomData?.opponentNickname || userName}
                    </h2>

                    <div className="inline-flex items-center gap-1 rounded-[50px] bg-[#ffd8001a] px-2 py-1 text-[#614e03]">
                        <Star className="h-4 w-4 fill-[#FFD800] text-[#FFD800]" />

                        {/* 유저 평점 */}
                        <span className="text-xs font-medium">
                            {roomData?.opponentRating || userRating}
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
                        <h2 className="text-base font-semibold">
                            {roomData?.gathering?.title || title}
                        </h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <p className="m-0 text-sm font-normal whitespace-nowrap text-[#666666]">
                                {`${roomData?.gathering?.startDate || startDate} - ${roomData?.gathering?.endDate || endDate}`}
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
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <LoadingThreeDots />
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-red-500">
                        {error}
                    </div>
                ) : roomIdValue ? (
                    <ChatRoom roomId={roomIdValue} kakaoId={userKakaoId} />
                ) : (
                    <ChatNotice />
                )}
            </section>
        </div>
    );
}
