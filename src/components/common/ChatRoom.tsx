'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChatNotice from './ChatNotice';
import LoadingThreeDots from './LoadingThreeDots';

// 시간 포맷팅 함수
const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

// 백엔드에서 받는 메시지 타입
interface MessageResponse {
    roomId: number;
    message: string;
    sentAt: string;
    senderId?: string;
    nickname?: string;
}

// UI용 메시지 타입
type Message = {
    messageId: number;
    text: string;
    messageFrom: 'user' | 'writer';
    timestamp: string;
};

interface ChatRoomProps {
    roomId: number;
    kakaoId?: string;
    messages?: {
        roomId: number;
        message: string;
        sentAt?: string;
        senderId?: string;
        nickname?: string;
    }[];
    onSendMessage?: (message: string) => void;
}

export default function ChatRoom({
    roomId,
    kakaoId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messages: initialMessages = [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSendMessage,
}: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 메시지 목록 가져오기
    const fetchMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';

            const response = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/messages`,
                {
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('메시지를 불러오는데 실패했습니다.');
            }

            const data: MessageResponse[] = await response.json();
            console.log('받은 메시지 데이터:', data);

            // 시간 기준으로 정렬 (오래된 메시지가 위로, 최신 메시지가 아래로)
            const sortedData = [...data].sort((a, b) => {
                const dateA = new Date(a.sentAt || '').getTime();
                const dateB = new Date(b.sentAt || '').getTime();
                return dateA - dateB;
            });

            // 받은 메시지를 Message 타입으로 변환
            const formattedMessages: Message[] = sortedData.map(
                (msg, index) => ({
                    messageId: index,
                    text: msg.message || '',
                    // 메시지 발신자 구분 (kakaoId가 있는 경우)
                    messageFrom:
                        kakaoId && msg.senderId === kakaoId ? 'writer' : 'user',
                    timestamp: formatTime(
                        msg.sentAt || new Date().toISOString(),
                    ),
                }),
            );

            setMessages(formattedMessages);

            // DOM이 업데이트된 후에 스크롤 강제 이동이 동작하도록 셋타임아웃
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
            }, 0);
        } catch (err) {
            console.error('메시지 로딩 오류:', err);
            setError('메시지를 불러오는데 문제가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [roomId, kakaoId]);

    // 메시지 전송
    const sendMessage = useCallback(() => {
        if (!newMessage.trim()) return;

        if (onSendMessage) {
            // 부모 컴포넌트에서 제공한 onSendMessage 함수 사용
            onSendMessage(newMessage);
            setNewMessage(''); // 입력 필드 초기화
        } else if (stompClient?.active) {
            // 기존 로직 (직접 소켓으로 전송)
            try {
                const payload = {
                    roomId,
                    message: newMessage.trim(),
                };

                stompClient.publish({
                    destination: '/app/chat.sendMessage',
                    body: JSON.stringify(payload),
                    headers: { 'content-type': 'application/json' },
                });

                // 메시지 전송 후 입력창 초기화
                setNewMessage('');

                // UI에 내 메시지 추가 (WebSocket으로 다시 받기 전에)
                const now = new Date().toISOString();
                const newMsg: Message = {
                    messageId: Date.now(),
                    text: newMessage.trim(),
                    messageFrom: 'user', // 내가 보낸 메시지는 'user'로 변경
                    timestamp: formatTime(now),
                };
                setMessages((prev) => [...prev, newMsg]);
            } catch (err) {
                console.error('메시지 전송 오류:', err);
                setError('메시지 전송에 실패했습니다.');
            }
        }
    }, [newMessage, onSendMessage, stompClient]);

    // 엔터키로 메시지 전송
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // 마지막 글자가 한 번 더 보내지는 현상 수정
            setTimeout(() => {
                sendMessage();
            }, 10);
        }
    };

    // WebSocket 연결 설정
    useEffect(() => {
        let mounted = true;
        if (!roomId) return;

        const connectWebSocket = async () => {
            try {
                const res = await fetch('/api/auth/ws-token', {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to get WebSocket token');

                const { wsToken } = await res.json();
                const wsUrl =
                    'wss://gateway.wego-travel.click/ws/chat/websocket';

                const client = new Client({
                    brokerURL: wsUrl,
                    connectHeaders: {
                        Authorization: `Bearer ${wsToken}`,
                    },
                    debug: (str) => console.log('STOMP Debug:', str),
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        if (!mounted) return;
                        setStompClient(client);
                        setError(null);
                        const subscriptionTopic = `/topic/chatroom/${roomId}`;
                        client.subscribe(
                            subscriptionTopic,
                            (message) => {
                                if (!mounted) return;
                                try {
                                    const receivedMessage = JSON.parse(
                                        message.body,
                                    );
                                    console.log(
                                        'Received message:',
                                        receivedMessage,
                                    );

                                    // 받은 메시지를 UI에 추가
                                    const newMsg: Message = {
                                        messageId: Date.now(),
                                        text: receivedMessage.message || '',
                                        // 메시지 발신자 구분
                                        messageFrom:
                                            receivedMessage.senderId === kakaoId
                                                ? 'writer'
                                                : 'user',
                                        timestamp: formatTime(
                                            receivedMessage.sentAt ||
                                                new Date().toISOString(),
                                        ),
                                    };

                                    setMessages((prev) => [...prev, newMsg]);
                                } catch (err) {
                                    console.error(
                                        'Error parsing message:',
                                        err,
                                        message.body,
                                    );
                                }
                            },
                            {
                                Authorization: `Bearer ${wsToken}`,
                            },
                        );

                        // 연결 후 메시지 목록 가져오기
                        fetchMessages();
                    },
                    onStompError: (frame) => {
                        if (!mounted) return;
                        console.error('STOMP error:', frame);
                        setError(
                            `WebSocket 연결 오류: ${frame.headers.message || '알 수 없는 오류'}`,
                        );
                        setStompClient(null);
                    },
                    onWebSocketError: (event) => {
                        if (!mounted) return;
                        console.error('WebSocket error:', event);
                        setError(
                            'WebSocket 연결 실패: 서버에 연결할 수 없습니다.',
                        );
                        setStompClient(null);
                    },
                    onWebSocketClose: (event) => {
                        if (!mounted) return;
                        console.log('WebSocket closed:', event);
                        if (event.code !== 1000) {
                            setError(`WebSocket 연결 종료: 코드 ${event.code}`);
                        }
                    },
                });

                client.activate();
            } catch (err) {
                if (!mounted) return;
                console.error('WebSocket connection error:', err);
                setError(
                    `WebSocket 연결 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`,
                );
            }
        };

        connectWebSocket();

        return () => {
            mounted = false;
            if (stompClient?.active) {
                stompClient.deactivate();
                setStompClient(null);
            }
        };
    }, [roomId, kakaoId, fetchMessages]);

    // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    // 로딩 중일 때 표시
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingThreeDots />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* 메시지 목록 */}
            <div className="custom-scrollbar flex-1 overflow-y-auto pr-4 pb-4">
                {messages.length === 0 ? (
                    <ChatNotice />
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => {
                            // 메시지 발신자 구분 로직
                            const isMyMessage = msg.messageFrom === 'user';

                            return (
                                <div
                                    key={msg.messageId}
                                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                            isMyMessage
                                                ? 'bg-sky-blue text-white'
                                                : 'bg-[#F0F0F0] text-black'
                                        }`}
                                    >
                                        <p className="break-words">
                                            {msg.text}
                                        </p>
                                        <p
                                            className={`mt-1 text-right text-xs ${
                                                isMyMessage
                                                    ? 'text-gray-200'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {msg.timestamp}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* 메시지 입력 영역 - onSendMessage가 제공된 경우 렌더링하지 않음 */}
            {!onSendMessage && (
                <div className="w-full rounded-xl border-solid bg-[#f9f9f9]">
                    <div className="p-5">
                        <div className="flex flex-col gap-10">
                            <Input
                                ref={inputRef}
                                placeholder="메세지를 입력하세요"
                                className="border-none bg-transparent text-base leading-[20.8px] font-normal text-black shadow-none placeholder:text-[#999999] focus-visible:ring-0"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={!stompClient?.active}
                            />
                            <div className="flex w-full items-center justify-end gap-2">
                                <Button
                                    className="px-5 py-2"
                                    onClick={sendMessage}
                                    disabled={
                                        !newMessage.trim() ||
                                        !stompClient?.active
                                    }
                                >
                                    전송
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
