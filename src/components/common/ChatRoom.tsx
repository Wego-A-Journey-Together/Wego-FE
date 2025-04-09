'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

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
    const [isSending, setIsSending] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const stompClient = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // STOMP 클라이언트 연결 설정
    useEffect(() => {
        // localStorage에서 토큰 가져오기
        const token = localStorage.getItem('accessToken');

        // 토큰이 없는 경우 처리
        if (!token) {
            setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
            setIsLoading(false);
            return;
        }

        const SOCKET_URL =
            process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';

        // STOMP 클라이언트 생성
        const client = new Client({
            webSocketFactory: () =>
                new SockJS(`${SOCKET_URL}/ws/chat/websocket`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log('STOMP 디버그:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // 연결 성공 콜백
        client.onConnect = () => {
            setIsConnected(true);

            // 채팅방 구독
            client.subscribe(`/topic/chatroom/${roomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);

                // 받은 메시지를 Message 타입으로 변환
                const formattedMessage: Message = {
                    messageId: Date.now(),
                    text: receivedMessage.message || '',
                    messageFrom:
                        receivedMessage.senderId === kakaoId
                            ? 'writer'
                            : 'user',
                    timestamp: formatTime(
                        receivedMessage.sentAt || new Date().toISOString(),
                    ),
                };

                setMessages((prevMessages) => [
                    ...prevMessages,
                    formattedMessage,
                ]);

                // 메시지 읽음 처리
                markMessagesAsRead();
            });

            // 이전 메시지 불러오기
            fetchMessages();
        };

        // 연결 오류 콜백
        client.onStompError = (frame) => {
            console.error('STOMP 에러:', frame);
            setError('채팅 연결에 문제가 발생했습니다.');
            setIsLoading(false);
        };

        // 연결 시작
        client.activate();
        stompClient.current = client;

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [roomId, kakaoId]);

    // 메시지 읽음 처리
    const markMessagesAsRead = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('인증 토큰이 없습니다.');
                return;
            }

            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';

            await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/read`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
        } catch (error) {
            console.error('메시지 읽음 처리에 실패했습니다.', error);
        }
    };

    // 메시지 불러오기
    const fetchMessages = async () => {
        try {
            setIsLoading(true);

            // 토큰 가져오기
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
            }

            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';

            const response = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/messages`,
                {
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error('메시지를 불러오는데 실패했습니다.');
            }

            const data: MessageResponse[] = await response.json();
            console.log('받은 메시지 데이터:', data);

            // 받은 메시지를 Message 타입으로 변환
            const formattedMessages: Message[] = data.map((msg) => ({
                messageId: Date.now() + Math.random(),
                text: msg.message || '',

                // 메시지 발신자 구분 (kakaoId가 있는 경우)
                messageFrom:
                    kakaoId && msg.senderId === kakaoId ? 'writer' : 'user',
                timestamp: formatTime(msg.sentAt || new Date().toISOString()),
            }));

            setMessages(formattedMessages);

            // 메시지 읽음 처리
            markMessagesAsRead();
        } catch (err) {
            console.error('메시지 로딩 오류:', err);
            setError('메시지를 불러오는데 문제가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 메시지 전송
    const sendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            setIsSending(true);

            // 토큰 가져오기
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
            }

            const now = new Date();
            const currentTime = formatTime(now.toISOString());

            // 보낸 메세지 데이터
            const tempMessage: Message = {
                messageId: Date.now(),
                text: newMessage,
                messageFrom: 'writer',
                timestamp: currentTime,
            };

            setMessages((prev) => [...prev, tempMessage]);

            // WebSocket으로 메시지 전송
            if (isConnected && stompClient.current) {
                // 백엔드용 메시지
                const messageToSend = {
                    roomId: roomId,
                    message: newMessage,
                };

                stompClient.current.publish({
                    destination: `/app/chat.sendMessage`,
                    body: JSON.stringify(messageToSend),
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            setNewMessage('');
        } catch (err) {
            console.error('메시지 전송 오류:', err);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <LoadingThreeDots />;
    }

    if (error) {
        return (
            <div className="flex justify-center p-4 text-red-500">{error}</div>
        );
    }

    // 엔터로 메세지 입력
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                    <ChatNotice />
                ) : (
                    messages.map((chatData) => (
                        <div
                            key={chatData.messageId}
                            className={`mb-4 flex ${
                                chatData.messageFrom === 'writer'
                                    ? 'justify-end pr-5'
                                    : 'justify-start pl-5'
                            }`}
                        >
                            {chatData.messageFrom === 'user' && (
                                <div className="mr-2.5 h-[30px] w-[30px] rounded-full bg-gray-200"></div>
                            )}
                            <div
                                className={`flex items-end gap-1.5 ${
                                    chatData.messageFrom === 'writer'
                                        ? 'flex-row-reverse'
                                        : 'flex-row'
                                }`}
                            >
                                <div
                                    className={`inline-flex max-w-xs items-center justify-center rounded-2xl p-2.5 ${
                                        chatData.messageFrom === 'writer'
                                            ? 'bg-[#0ac7e414]'
                                            : 'bg-[#f5f6f7]'
                                    }`}
                                >
                                    <p className="m-0 text-sm">
                                        {chatData.text}
                                    </p>
                                </div>
                                <span className="text-xs text-[#999999]">
                                    {chatData.timestamp}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 폼 */}
            <form
                onSubmit={sendMessage}
                className="mt-auto flex items-center gap-2 border-t p-4"
            >
                <Input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={isSending || !isConnected}
                />
                <Button
                    type="submit"
                    disabled={isSending || !newMessage.trim() || !isConnected}
                >
                    {isSending ? '전송 중...' : '전송'}
                </Button>
            </form>
        </div>
    );
}
