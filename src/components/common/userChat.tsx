'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSession } from '@/hooks/useSession';
import { Client } from '@stomp/stompjs';
import { Calendar, Star, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChatNotice from './ChatNotice';
import ChatRoom from './ChatRoom';
import LoadingThreeDots from './LoadingThreeDots';

interface UserChatProps {
    userName: string;
    userRating: number;
    title: string;
    startDate: string;
    endDate: string;
    onClose?: () => void;
    onParticipate?: () => void;
    roomId?: number;
    postId?: number;
    opponentKakaoId?: string | null;
}

interface ChatMessage {
    roomId: number;
    message: string;
    sentAt?: string;
    senderId?: number;
    nickname?: string;
    messageFrom?: 'user' | 'writer';
}

export default function UserChat({
    userName,
    userRating,
    title,
    startDate,
    endDate,
    onClose,
    onParticipate,
    roomId: initialRoomId,
    opponentKakaoId,
}: UserChatProps) {
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState<number | undefined>(initialRoomId);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [wsToken, setWsToken] = useState<string | null>(null);
    const stompClient = useRef<Client | null>(null);
    const { kakaoId } = useSession();

    const NEXT_PUBLIC_NEST_BFF_URL =
        process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';
    const WS_URL = 'wss://gateway.wego-travel.click/ws/chat/websocket';

    // 1. 웹소켓 연결 인증 토큰 가져오기
    useEffect(() => {
        const fetchWsToken = async () => {
            try {
                const response = await fetch('/api/auth/ws-token', {
                    credentials: 'include',
                });
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

                // 채팅 메시지 목록 조회
                const messagesResponse = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/messages`,
                    {
                        credentials: 'include',
                    },
                );

                // 읽음 처리 요청
                await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/read`,
                    {
                        method: 'PATCH',
                        credentials: 'include',
                    },
                );

                if (!messagesResponse.ok) {
                    throw new Error(
                        `메시지 목록을 가져오는데 실패했습니다: ${messagesResponse.status}`,
                    );
                }

                const messagesData = await messagesResponse.json();

                // 메시지 시간순으로 정렬 (최신 메시지가 아래에 오도록)
                const sortedMessages = Array.isArray(messagesData)
                    ? messagesData.sort(
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
        let mounted = true;
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
            if (!mounted) return;
            console.log('Connected to STOMP');
            stompClient.current = client;

            // 채팅방 구독
            client.subscribe(`/topic/chatroom/${roomId}`, function (message) {
                if (!mounted) return;
                if (message.body) {
                    try {
                        const receivedMsg = JSON.parse(message.body);
                        console.log('Received message:', receivedMsg);

                        // 메시지 추가
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
                        ).catch((err) => console.error('읽음 처리 오류:', err));
                    } catch (err) {
                        console.error(
                            'Error parsing message:',
                            err,
                            message.body,
                        );
                    }
                }
            });
        };

        // 에러 처리
        client.onStompError = function (frame) {
            if (!mounted) return;
            console.error('STOMP error:', frame);
            setError(
                `WebSocket 연결 오류: ${frame.headers.message || '알 수 없는 오류'}`,
            );
        };

        client.onWebSocketError = (event) => {
            if (!mounted) return;
            console.error('WebSocket error:', event);
            setError('WebSocket 연결 실패: 서버에 연결할 수 없습니다.');
        };

        client.onWebSocketClose = (event) => {
            if (!mounted) return;
            console.log('WebSocket closed:', event);
            if (event.code !== 1000) {
                setError(`WebSocket 연결 종료: 코드 ${event.code}`);
            }
        };

        // 연결
        client.activate();
        stompClient.current = client;

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            mounted = false;
            if (client.connected) {
                client.deactivate();
            }
            stompClient.current = null;
        };
    }, [wsToken, roomId, NEXT_PUBLIC_NEST_BFF_URL]);

    // 4. 메시지 전송
    const sendMessage = useCallback(() => {
        if (!message.trim() || !roomId || !stompClient.current?.connected)
            return;

        try {
            // 현재 시간 생성
            const now = new Date().toISOString();

            // 내가 보낸 메시지를 UI에 먼저 추가
            const myMessage: ChatMessage = {
                roomId: roomId,
                message: message.trim(),
                sentAt: now,
                senderId: Number(kakaoId),
                messageFrom: 'user', // 내 메시지임을 명시
            };

            // UI에 메시지 추가
            setMessages((prev) =>
                [...prev, myMessage].sort(
                    (a, b) =>
                        new Date(a.sentAt || '').getTime() -
                        new Date(b.sentAt || '').getTime(),
                ),
            );

            // 서버로 메시지 전송
            stompClient.current.publish({
                destination: '/app/chat.sendMessage',
                headers: {
                    Authorization: `Bearer ${wsToken}`,
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    roomId: roomId,
                    message: message.trim(),
                }),
            });
            setMessage('');
        } catch (err) {
            console.error('메시지 전송 오류:', err);
            setError(
                `메시지 전송 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`,
            );
        }
    }, [message, roomId, stompClient, wsToken, kakaoId]);

    // 5. 채팅방 생성 또는 가져오기
    const createOrGetChatRoom = useCallback(async () => {
        if (!opponentKakaoId || !kakaoId) {
            setError('상대방 또는 내 정보가 없습니다.');
            return;
        }
        try {
            setIsLoading(true);

            // 채팅방 생성 또는 가져오기 API 호출
            const response = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        opponentKakaoId,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(`채팅방 생성 실패: ${response.status}`);
            }

            const data = await response.json();
            setRoomId(data.roomId);
            setError(null);
        } catch (err) {
            console.error('채팅방 생성 오류:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류');
        } finally {
            setIsLoading(false);
        }
    }, [opponentKakaoId, kakaoId, NEXT_PUBLIC_NEST_BFF_URL]);

    // 채팅방이 없으면 생성
    useEffect(() => {
        if (!roomId && opponentKakaoId) {
            createOrGetChatRoom();
        }
    }, [roomId, opponentKakaoId, createOrGetChatRoom]);

    // 엔터키로 메시지 전송
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* 채팅창 헤더 */}
            <SheetHeader className="border-b px-5 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1">
                        <SheetTitle className="m-0 text-[15px] font-semibold">
                            {userName}
                        </SheetTitle>
                        <div className="inline-flex items-center gap-1 rounded-[50px] bg-[#ffd8001a] px-2 py-1 text-[#614e03]">
                            <Star className="h-4 w-4 fill-[#FFD800] text-[#FFD800]" />
                            <span className="text-xs font-medium">
                                {userRating}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-6 w-6 items-center justify-center"
                    >
                        <X className="h-5 w-5 cursor-pointer text-[#333333]" />
                    </button>
                </div>
            </SheetHeader>

            {/* 게시글 제목, 상태, 참여하기 버튼 섹션 */}
            <div className="flex w-full flex-col gap-2.5 border-b px-5 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 flex-col gap-[3px] pr-2">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <p className="m-0 text-sm font-normal text-[#666666]">
                                {`${startDate} - ${endDate}`}
                            </p>
                        </div>
                    </div>

                    <Button className="px-[30px] py-2" onClick={onParticipate}>
                        참여하기
                    </Button>
                </div>
            </div>

            {/* 채팅 말풍선 섹션 */}
            <div className="scrollbar-hide flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <LoadingThreeDots />
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-red-500">
                        {error}
                    </div>
                ) : roomId ? (
                    <ChatRoom
                        roomId={roomId}
                        kakaoId={kakaoId?.toString()}
                        messages={messages.map((msg) => ({
                            ...msg,
                            senderId: msg.senderId?.toString(),
                        }))}
                        onSendMessage={sendMessage}
                    />
                ) : (
                    <ChatNotice />
                )}
            </div>

            {/* 메시지 입력 영역 */}
            <SheetFooter className="border-t p-4">
                <div className="w-full rounded-xl border-solid bg-[#f9f9f9]">
                    <div className="p-5">
                        <div className="flex flex-col gap-10">
                            <Input
                                placeholder="메세지를 입력하세요"
                                className="border-none bg-transparent text-base leading-[20.8px] font-normal text-black shadow-none placeholder:text-[#999999] focus-visible:ring-0"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={!roomId || isLoading}
                            />
                            <div className="flex w-full items-center justify-end gap-2">
                                <Button
                                    className="px-5 py-2"
                                    onClick={sendMessage}
                                    disabled={
                                        !message.trim() || !roomId || isLoading
                                    }
                                >
                                    전송
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetFooter>
        </div>
    );
}
