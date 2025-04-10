'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useSession } from '@/hooks/useSession';
import { Client } from '@stomp/stompjs';
import { Calendar, MoreHorizontal, Star, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
    const [stompClient, setStompClient] = useState<Client | null>(null);

    const { kakaoId } = useSession();

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
                const wsUrl = 'wss://gateway.wego-travel.click/ws/chat';

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
    }, [roomId]);

    const sendMessage = useCallback(() => {
        if (!message.trim() || !roomId || !stompClient?.active) return;
        try {
            const payload: ChatMessage = {
                roomId,
                message: message.trim(),
            };
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(payload),
                headers: { 'content-type': 'application/json' },
            });
            setMessage('');
        } catch (err) {
            console.error('Message sending error:', err);
            setError(
                `메시지 전송 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`,
            );
        }
    }, [message, roomId, stompClient]);

    const createOrGetChatRoom = useCallback(async () => {
        if (!opponentKakaoId || !kakaoId) {
            setError('상대방 또는 내 정보가 없습니다.');
            return;
        }
        try {
            setIsLoading(true);
            const baseUrl =
                process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';
            const res = await fetch(`${baseUrl}/api/chat/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opponentKakaoId }),
                credentials: 'include',
            });
            if (!res.ok) throw new Error(`채팅방 생성 실패: ${res.status}`);
            const data = await res.json();
            setRoomId(data.roomId);
            return data.roomId;
        } catch (error) {
            setError(
                `채팅방 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [opponentKakaoId, kakaoId]);

    useEffect(() => {
        if (!roomId && opponentKakaoId) {
            createOrGetChatRoom();
        }
    }, [roomId, opponentKakaoId, createOrGetChatRoom]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="bg-background-light flex h-full flex-col">
            <SheetHeader className="flex h-[72px] w-full flex-row items-center justify-between px-5 py-2.5">
                <button onClick={onClose} aria-label="창 닫기">
                    <X className="h-4 w-4" />
                </button>
                <div className="inline-flex items-center gap-1">
                    <SheetTitle className="text-[15px] font-semibold text-black">
                        {userName}
                    </SheetTitle>
                    <div className="inline-flex items-center gap-1 rounded-[50px] bg-[#ffd8001a] px-2 py-1 text-[#614e03]">
                        <Star className="h-4 w-4 fill-[#FFD800] text-[#FFD800]" />
                        <span className="text-xs font-medium">
                            {userRating}
                        </span>
                    </div>
                </div>
                <MoreHorizontal className="h-5 w-5 cursor-pointer text-[#333333]" />
            </SheetHeader>

            <section className="flex w-full flex-col gap-2.5 border-b px-5 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex w-[365px] flex-col gap-[3px]">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <SheetDescription className="text-sm font-normal text-[#666666]">
                                {`${startDate} - ${endDate}`}
                            </SheetDescription>
                        </div>
                    </div>
                    <Button onClick={onParticipate}>참여하기</Button>
                </div>
            </section>

            <section className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <LoadingThreeDots />
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-red-500">
                        {error}
                    </div>
                ) : roomId ? (
                    <ChatRoom roomId={roomId} kakaoId={kakaoId || undefined} />
                ) : (
                    <ChatNotice />
                )}
            </section>

            <SheetFooter className="flex flex-col items-center justify-center gap-2.5 bg-white px-2.5 py-5">
                <div className="w-full rounded-xl border-solid bg-[#f9f9f9]">
                    <div className="p-5">
                        <div className="flex flex-col gap-10">
                            <Input
                                placeholder="메세지를 입력하세요"
                                className="border-none bg-transparent text-base leading-[20.8px] font-normal text-[#999999] shadow-none focus-visible:ring-0"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isLoading}
                            />
                            <div className="flex w-full items-center justify-end gap-2">
                                <Button
                                    className="px-5 py-2"
                                    onClick={sendMessage}
                                    disabled={isLoading || !roomId}
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
