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
}

export default function ChatRoom({ roomId, kakaoId }: ChatRoomProps) {
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

            // 받은 메시지를 Message 타입으로 변환
            const formattedMessages: Message[] = data.map((msg, index) => ({
                messageId: index,
                text: msg.message || '',
                // 메시지 발신자 구분 (kakaoId가 있는 경우)
                messageFrom:
                    kakaoId && msg.senderId === kakaoId ? 'writer' : 'user',
                timestamp: formatTime(msg.sentAt || new Date().toISOString()),
            }));

            setMessages(formattedMessages);
        } catch (err) {
            console.error('메시지 로딩 오류:', err);
            setError('메시지를 불러오는데 문제가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [roomId, kakaoId]);

    // 메시지 전송
    const sendMessage = useCallback(() => {
        if (!newMessage.trim() || !roomId || !stompClient?.active) return;

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
                messageFrom: 'writer',
                timestamp: formatTime(now),
            };
            setMessages((prev) => [...prev, newMsg]);
        } catch (err) {
            console.error('메시지 전송 오류:', err);
            setError('메시지 전송에 실패했습니다.');
        }
    }, [newMessage, roomId, stompClient]);

    // 엔터키로 메시지 전송
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 로딩 중일 때 표시
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingThreeDots />
            </div>
        );
    }

    // 에러 발생 시 표시
    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-red-500">
                <p>{error}</p>
                <Button onClick={() => window.location.reload()}>
                    다시 시도하기
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto pb-4">
                {messages.length === 0 ? (
                    <ChatNotice />
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.messageId}
                                className={`flex ${
                                    msg.messageFrom === 'writer'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                        msg.messageFrom === 'writer'
                                            ? 'bg-[#4D7BFF] text-white'
                                            : 'bg-[#F0F0F0] text-black'
                                    }`}
                                >
                                    <p className="break-words">{msg.text}</p>
                                    <p
                                        className={`mt-1 text-right text-xs ${
                                            msg.messageFrom === 'writer'
                                                ? 'text-gray-200'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* 메시지 입력 영역 */}
            <div className="mt-4 flex items-center gap-2 border-t pt-4">
                <Input
                    ref={inputRef}
                    className="flex-1"
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!stompClient?.active}
                />
                <Button
                    className="h-10 w-10 rounded-full p-0"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !stompClient?.active}
                >
                    <span>전송</span>
                </Button>
            </div>
        </div>
    );
}
