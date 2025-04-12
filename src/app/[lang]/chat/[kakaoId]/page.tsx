'use client';

import ChatPreview from '@/components/chat/ChatPreview';
import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 내가 참여 중인 채팅방 목록 조회
interface ChatRoom {
    roomId: number;
    opponentKakaoId: number;
    opponentNickname: string;
    lastMessage: string;
    unreadCount: number;
    thumbnailUrl?: string;
}

// 채팅 상대 프로필 표시를 위한 호출
interface OpponentUserProfile {
    thumbnailUrl: string;
    statusMessage: string; // 유저 프로필에는 지역 정보가 없어 상태 메세지로 대체합니다.
}

export default function Chat() {
    const params = useParams();
    const kakaoId = params?.kakaoId as string;
    const session = useSession();
    const router = useRouter();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const [chatPreview, setChatPreview] = useState<ChatRoom[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionVerified, setSessionVerified] = useState(false);
    const [userProfiles, setUserProfiles] = useState<
        Record<number, OpponentUserProfile>
    >({});

    useEffect(() => {
        if (!session) return;

        const currentUserKakaoId = session?.kakaoId?.toString();
        const requestedKakaoId = kakaoId?.toString();

        if (
            !session.isAuthenticated ||
            !currentUserKakaoId ||
            currentUserKakaoId !== requestedKakaoId
        ) {
            // 로그인 페이지로 리다이렉트하고 경고 메시지 표시
            alert('로그인이 필요한 서비스입니다.');
            router.push('/');
        } else {
            setSessionVerified(true);
        }
    }, [session, kakaoId, router]);

    useEffect(() => {
        if (!sessionVerified) return;

        const fetchData = async () => {
            try {
                if (!NEXT_PUBLIC_NEST_BFF_URL) {
                    throw new Error('API URL이 설정되지 않았습니다.');
                }

                // 채팅방 목록 조회
                const chatRes = await fetch(
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

                // 프로필 정보 조회
                const profileRes = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/profile/${kakaoId}`,
                    {
                        credentials: 'include',
                    },
                );

                const [chatRooms, profile] = await Promise.all([
                    chatRes.json(),
                    profileRes.json(),
                ]);

                setChatPreview(Array.isArray(chatRooms) ? chatRooms : []);
                setUserProfiles({ [profile.kakaoId]: profile });
            } catch (error) {
                setErrorMessage(`데이터를 불러오는데 실패했습니다. ${error}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sessionVerified, NEXT_PUBLIC_NEST_BFF_URL, kakaoId]);

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
                    ) : chatPreview.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            아직 대화 목록이 없습니다.
                        </div>
                    ) : (
                        <ul className="list-none space-y-[30px] p-0">
                            {chatPreview.map((chatData) => (
                                <li key={chatData.roomId}>
                                    <Link
                                        href={`/chat/${kakaoId}/rooms/${chatData.roomId}`}
                                    >
                                        <ChatPreview
                                            chatData={{
                                                roomId: chatData.roomId,
                                                name: chatData.opponentNickname,
                                                lastMessage:
                                                    chatData.lastMessage,
                                                unreadChat:
                                                    chatData.unreadCount,

                                                // 원래는 Location이나, 현재 프로필에 지역정보가 없어서 일단 상태메세지로 대체합니다.
                                                statusMessage:
                                                    userProfiles[
                                                        chatData.opponentKakaoId
                                                    ]?.statusMessage ||
                                                    '상태 메시지가 없습니다',
                                                thumbnailUrl:
                                                    userProfiles[
                                                        chatData.opponentKakaoId
                                                    ]?.thumbnailUrl ||
                                                    '/icon/profile/defaultProfile.svg',
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
