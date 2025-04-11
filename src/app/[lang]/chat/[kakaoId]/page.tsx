'use client';

import ChatPreview from '@/components/chat/ChatPreview';
import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatRoom {
    roomId: number;
    opponentNickname: string;
    lastMessage: string;
    unreadCount: number;
    time?: string;
    location?: string;
    userIcon?: string;
}

export default function Chat() {
    const params = useParams();
    const kakaoId = params?.kakaoId as string;
    const session = useSession();
    const router = useRouter();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const [chatData, setChatData] = useState<ChatRoom[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionVerified, setSessionVerified] = useState(false);

    useEffect(() => {
        if (!session) return;

        const currentUserKakaoId = session?.kakaoId?.toString();
        const requestedKakaoId = kakaoId?.toString();

        if (
            !session.isAuthenticated ||
            !currentUserKakaoId ||
            currentUserKakaoId !== requestedKakaoId
        ) {
            router.push('/404');
        } else {
            setSessionVerified(true);
        }
    }, [session, kakaoId, router]);

    useEffect(() => {
        if (!sessionVerified) return;

        const fetchChatRooms = async () => {
            try {
                if (!NEXT_PUBLIC_NEST_BFF_URL) {
                    throw new Error('API URL이 설정되지 않았습니다.');
                }

                const res = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                    {
                        credentials: 'include',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        cache: 'no-store',
                    },
                );

                if (!res.ok) {
                    setErrorMessage('데이터를 불러오는데 실패했습니다.');
                } else {
                    const responseData = await res.json();
                    const rooms = Array.isArray(responseData)
                        ? responseData
                        : [];

                    const formattedRooms = rooms.map((room) => ({
                        ...room,
                        name: room.opponentNickname,
                        message: room.lastMessage,
                        unreadChat: room.unreadCount,
                        time: room.time || '',
                        location: room.location || '',
                        userIcon: room.userIcon || '',
                    }));

                    setChatData(formattedRooms);
                }
            } catch (error) {
                setErrorMessage(`데이터를 불러오는데 실패했습니다. ${error}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatRooms();
    }, [sessionVerified, NEXT_PUBLIC_NEST_BFF_URL]);

    const HEADER_HEIGHT = 72;

    if (isLoading) {
        return (
            <div className="py-10 text-center">
                <LoadingThreeDots />
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main
                className="bg-background-light mx-auto max-w-[580px] border-x-1 border-[#E9E9E9]"
                style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            >
                <header className="px-5 pt-10 pb-[50px]">
                    <h1 className="text-xl font-semibold">대화 목록</h1>
                </header>

                <div className="overflow-y-auto px-4">
                    {errorMessage ? (
                        <div className="py-10 text-center text-gray-500">
                            데이터를 불러오는데 실패했습니다.
                        </div>
                    ) : chatData.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            아직 대화 목록이 없습니다.
                        </div>
                    ) : (
                        <ul className="list-none space-y-[30px] p-0">
                            {chatData.map((chat) => (
                                <li key={chat.roomId}>
                                    <Link
                                        href={`/chat/${kakaoId}/rooms/${chat.roomId}`}
                                    >
                                        <ChatPreview
                                            chat={{
                                                roomId: chat.roomId,
                                                name: chat.opponentNickname,
                                                location: chat.location || '',
                                                time: chat.time || '',
                                                message: chat.lastMessage,
                                                unreadChat: chat.unreadCount,
                                                userIcon: chat.userIcon || '',
                                            }}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </>
    );
}
