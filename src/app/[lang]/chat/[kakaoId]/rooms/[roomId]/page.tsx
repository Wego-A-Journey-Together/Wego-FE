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
    senderId?: string;
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
                console.log('wsToken:', data.wsToken);
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
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const roomsResponse = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                    {
                        credentials: 'include',
                    },
                );

                const messagesResponse = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/messages`,
                    {
                        credentials: 'include',
                    },
                );

                await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/read`,
                    {
                        method: 'PATCH',
                        credentials: 'include',
                    },
                );

                let roomData = {
                    opponentNickname: '',
                    userRating: 0,
                    title: '',
                    startDate: '',
                    endDate: '',
                };

                if (!roomsResponse.ok) {
                    console.warn(`채팅방 목록 실패: ${roomsResponse.status}`);
                } else {
                    const roomsList = await roomsResponse.json();
                    const currentRoom = Array.isArray(roomsList)
                        ? roomsList.find((room) => room.roomId === roomId)
                        : null;

                    if (currentRoom) {
                        roomData = {
                            opponentNickname:
                                currentRoom.opponentNickname || '',
                            userRating: currentRoom.userRating || 0,
                            title: currentRoom.title || '',
                            startDate: currentRoom.startDate || '',
                            endDate: currentRoom.endDate || '',
                        };
                    } else {
                        console.warn(
                            `roomId ${roomId}에 해당하는 채팅방이 없습니다.`,
                        );
                    }
                }

                if (!messagesResponse.ok) {
                    throw new Error(
                        `메시지 로딩 실패: ${messagesResponse.status}`,
                    );
                }

                const messagesData = await messagesResponse.json();
                console.log('messagesData:', messagesData);

                setChatRoomData({
                    userName: roomData.opponentNickname || '',
                    userRating: roomData.userRating || 0,
                    title: roomData.title || '',
                    startDate: roomData.startDate || '',
                    endDate: roomData.endDate || '',
                });

                const sortedMessages = Array.isArray(messagesData)
                    ? messagesData
                          .map((msg) => ({
                              ...msg,
                              senderId: msg.senderId?.toString(),
                          }))
                          .sort(
                              (a, b) =>
                                  new Date(a.sentAt).getTime() -
                                  new Date(b.sentAt).getTime(),
                          )
                    : [];

                setMessages(sortedMessages);
            } catch (err) {
                console.error('채팅방 데이터 로딩 오류:', err);
                setError(
                    err instanceof Error ? err.message : '알 수 없는 오류',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomId, NEXT_PUBLIC_NEST_BFF_URL]);

    // 3. WebSocket 연결 및 구독 설정
    useEffect(() => {
        if (!wsToken || !roomId) return;

        // STOMP 클라이언트 생성
        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: {
                Authorization: `Bearer ${wsToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // 연결 성공 시 콜백
        client.onConnect = function () {
            console.log('Connected to STOMP');

            client.subscribe(`/topic/chatroom/${roomId}`, function (message) {
                if (message.body) {
                    const receivedMsg = JSON.parse(message.body);
                    console.log('Received message:', receivedMsg);

                    const processedMsg = {
                        ...receivedMsg,
                        senderId: receivedMsg.senderId?.toString(),
                    };

                    // 메시지 추가
                    setMessages((prev) =>
                        [...prev, processedMsg].sort(
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
                    ).catch((err) => console.error('읽음 처리 오류:', err));
                }
            });
        };

        // 에러 처리
        client.onStompError = function (frame) {
            console.error('STOMP error:', frame.headers['message']);
            setError('WebSocket 연결 오류가 발생했습니다.');
        };

        // 연결
        client.activate();
        stompClient.current = client;

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (client.connected) {
                client.deactivate();
            }
        };
    }, [wsToken, roomId, NEXT_PUBLIC_NEST_BFF_URL]);

    // 4. 메시지 전송
    const handleSendMessage = async (message: string) => {
        if (
            !message.trim() ||
            !stompClient.current ||
            !stompClient.current.connected
        )
            return;

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

    const handleClose = () => {
        router.back();
    };

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
                        skipRoomDataFetch={true}
                    />
                )}
            </main>
        </>
    );
}
