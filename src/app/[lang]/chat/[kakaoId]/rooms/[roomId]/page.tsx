'use client';

import ChatPageView from '@/components/common/ChatPageView';
import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatRoomData {
    userName: string;
    userRating: number;
    title: string;
    startDate: string;
    endDate: string;
}

export default function ChatPage() {
    const params = useParams();
    const roomId = parseInt(params.roomId as string, 10);
    const router = useRouter();
    const [chatRoomData, setChatRoomData] = useState<ChatRoomData>({
        userName: '',
        userRating: 0,
        title: '',
        startDate: '',
        endDate: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChatRoomData = async () => {
            try {
                setIsLoading(true);
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL ||
                    'http://localhost:3000';
                const response = await fetch(
                    // 내가 참여 중인 채팅방 목록 조회
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                    {
                        credentials: 'include',
                    },
                );
                if (!response.ok) {
                    throw new Error(
                        `채팅방 정보를 가져오는데 실패했습니다: ${response.status}`,
                    );
                }

                const data = await response.json();
                setChatRoomData({
                    userName: data.opponentNickname || '',
                    userRating: data.userRating || 0,
                    title: data.title || '',
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                });
            } catch (err) {
                console.error('채팅방 정보 로딩 오류:', err);
                setError(
                    err instanceof Error ? err.message : '알 수 없는 오류',
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (roomId) {
            fetchChatRoomData();
        }
    }, [roomId]);

    const handleClose = () => {
        router.back();
    };

    // 컴포넌트 연결하기
    const handleParticipate = () => {
        alert('참여 신청이 완료되었습니다.');
    };

    const HEADER_HEIGHT = 72;
    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main
                className="mx-auto w-full max-w-[580px] bg-white"
                style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            >
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <LoadingThreeDots />
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <ChatPageView
                        userName={chatRoomData.userName}
                        userRating={chatRoomData.userRating}
                        title={chatRoomData.title}
                        startDate={chatRoomData.startDate}
                        endDate={chatRoomData.endDate}
                        onClose={handleClose}
                        onParticipate={handleParticipate}
                        roomId={roomId}
                    />
                )}
            </main>
        </>
    );
}
