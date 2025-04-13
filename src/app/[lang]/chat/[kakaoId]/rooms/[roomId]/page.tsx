'use client';

import ChatPageView from '@/components/common/ChatPageView';
import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { Client } from '@stomp/stompjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ChatRoomData {
    userName: string;
    userRating: number;
    title: string;
    startDate: string;
    endDate: string;
}

interface ChatMessage {
    roomId: number;
    message: string;
    sentAt: string;
    senderId?: number;
    nickname?: string;
}

export default function ChatPage() {
    const params = useParams();
    const roomId = parseInt(params.roomId?.toString() || '0', 10);
    const kakaoId = params.kakaoId as string;
    const router = useRouter();
    const [chatRoomData, setChatRoomData] = useState<ChatRoomData>({
        userName: '',
        userRating: 0,
        title: '',
        startDate: '',
        endDate: '',
    });
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [wsToken, setWsToken] = useState<string | null>(null);
    const stompClient = useRef<Client | null>(null);
    const NEXT_PUBLIC_NEST_BFF_URL =
        process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';
    const WS_URL = 'wss://gateway.wego-travel.click/ws/chat/websocket';

    // 1. 웹소켓 연결 인증 토큰 가져오기
    useEffect(() => {
        const fetchWsToken = async () => {
            try {
                const response = await fetch('/api/auth/ws-token');
                if (!response.ok) {
                    throw new Error('Failed to get WebSocket token');
                }
                const data = await response.json();
                setWsToken(data.wsToken);
            } catch (err) {
                console.error('WebSocket token error:', err);
                setError(
                    '인증 토큰을 가져오는데 실패했습니다. 다시 로그인해주세요.',
                );
            }
        };

        fetchWsToken();
    }, []);

    // 2. 채팅방 정보 및 메시지 초기 로딩
    useEffect(() => {
        if (!roomId) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);

                const createRoomResponse = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ opponentKakaoId: kakaoId }),
                        credentials: 'include',
                    },
                );

                if (!createRoomResponse.ok) {
                    throw new Error('채팅방 생성 또는 조회에 실패했습니다.');
                }

                const roomData = await createRoomResponse.json();

                // roomId가 URL과 다르면 리다이렉트
                if (roomData.roomId !== roomId) {
                    router.replace(`/chat/${kakaoId}/rooms/${roomData.roomId}`);
                    return;
                }

                // 메시지, 읽음 처리, 채팅방 리스트 조회
                const [roomsResponse, messagesResponse] = await Promise.all([
                    fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`, {
                        credentials: 'include',
                    }),
                    fetch(
                        `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/messages`,
                        {
                            credentials: 'include',
                        },
                    ),
                ]);

                await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/read`,
                    {
                        method: 'PATCH',
                        credentials: 'include',
                    },
                );

                let roomDeta = {
                    opponentNickname: '',
                    userRating: 0,
                    title: '',
                    startDate: '',
                    endDate: '',
                };

                interface ChatRoom {
                    roomId: number;
                    opponentNickname: string;
                    userRating: number;
                    title: string;
                    startDate: string;
                    endDate: string;
                }

                if (roomsResponse.ok) {
                    const roomsList = await roomsResponse.json();
                    const currentRoom = roomsList.find(
                        (room: ChatRoom) => room.roomId === roomId,
                    );
                    if (currentRoom) {
                        roomDeta = {
                            opponentNickname:
                                currentRoom.opponentNickname || '',
                            userRating: currentRoom.userRating || 0,
                            title: currentRoom.title || '',
                            startDate: currentRoom.startDate || '',
                            endDate: currentRoom.endDate || '',
                        };
                    }
                }

                if (!messagesResponse.ok) {
                    const errorText = await messagesResponse.text();
                    throw new Error(
                        `메시지 불러오기 실패: ${messagesResponse.status} - ${errorText}`,
                    );
                }

                const messagesData = await messagesResponse.json();

                setChatRoomData({
                    userName: roomDeta.opponentNickname,
                    userRating: roomDeta.userRating,
                    title: roomDeta.title,
                    startDate: roomDeta.startDate,
                    endDate: roomDeta.endDate,
                });

                const sortedMessages = messagesData.sort(
                    (a: ChatMessage, b: ChatMessage) =>
                        new Date(a.sentAt).getTime() -
                        new Date(b.sentAt).getTime(),
                );

                setMessages(sortedMessages);
            } catch (err) {
                console.error('채팅방 로딩 실패:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : '채팅방 로딩 중 오류 발생',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomId, kakaoId, NEXT_PUBLIC_NEST_BFF_URL, router]);

    // 3. WebSocket 연결
    useEffect(() => {
        if (!wsToken || !roomId) return;

        let mounted = true;

        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: {
                Authorization: `Bearer ${wsToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            if (!mounted) return;

            client.subscribe(`/topic/chatroom/${roomId}`, (message) => {
                if (!mounted || !message.body) return;

                const receivedMsg = JSON.parse(message.body);
                setMessages((prev) =>
                    [...prev, receivedMsg].sort(
                        (a, b) =>
                            new Date(a.sentAt).getTime() -
                            new Date(b.sentAt).getTime(),
                    ),
                );

                // 읽음 처리
                fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/read`,
                    {
                        method: 'PATCH',
                        credentials: 'include',
                    },
                ).catch((err) => console.error('읽음 처리 실패:', err));
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame.headers['message']);
            setError('WebSocket STOMP 오류가 발생했습니다.');
        };

        client.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
            setError('WebSocket 연결 실패');
        };

        client.onWebSocketClose = (event) => {
            console.warn('WebSocket closed:', event);
        };

        client.activate();
        stompClient.current = client;

        return () => {
            mounted = false;
            if (client.connected) client.deactivate();
            stompClient.current = null;
        };
    }, [wsToken, roomId, NEXT_PUBLIC_NEST_BFF_URL]);

    // 4. 메시지 전송
    const handleSendMessage = async (message: string) => {
        if (!message.trim() || !stompClient.current?.connected) return;

        try {
            stompClient.current.publish({
                destination: '/app/chat.sendMessage',
                headers: {
                    Authorization: `Bearer ${wsToken}`,
                },
                body: JSON.stringify({
                    roomId: roomId,
                    message: message,
                }),
            });
        } catch (err) {
            console.error('메시지 전송 오류:', err);
            alert('메시지 전송에 실패했습니다.');
        }
    };

    const handleClose = () => router.back();

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
                        kakaoId={kakaoId}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                    />
                )}
            </main>
        </>
    );
}
