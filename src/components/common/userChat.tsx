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
import SockJS from 'sockjs-client';

import ChatNotice from './ChatNotice';
import ChatRoom from './ChatRoom';

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
    postId,
}: UserChatProps) {
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState<number | undefined>(initialRoomId);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    const { kakaoId } = useSession();

    // WebSocket 연결 설정
    useEffect(() => {
        let mounted = true;
        if (!roomId) return;

        const connectWebSocket = async () => {
            try {
                const res = await fetch('/api/auth/ws-token', {
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to get WebSocket token');
                }

                const { wsToken } = await res.json();

                const SOCKET_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL ||
                    'http://localhost:3000';

                const client = new Client({
                    webSocketFactory: () =>
                        new SockJS(`${SOCKET_URL}/ws/chat/websocket`),
                    connectHeaders: {
                        Authorization: `Bearer ${wsToken}`,
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        if (!mounted) return;
                        setStompClient(client);
                        setError(null);
                        client.subscribe(
                            `/topic/chatroom/${roomId}`,
                            (message) => {
                                if (!mounted) return;
                                const receivedMessage = JSON.parse(
                                    message.body,
                                );
                                console.log(
                                    'Received message:',
                                    receivedMessage,
                                );
                            },
                        );
                    },
                    onStompError: () => {
                        if (!mounted) return;
                        setError('WebSocket 연결 오류가 발생했습니다.');
                        setStompClient(null);
                    },
                });

                client.activate();
            } catch (err) {
                if (!mounted) return;
                console.error('WebSocket connection error:', err);
                setError('WebSocket 연결에 실패했습니다.');
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]); // stompClient intentionally excluded

    const sendMessage = async () => {
        if (!message.trim() || !roomId || !stompClient?.active) return;

        try {
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify({
                    roomId: roomId,
                    message: message.trim(),
                }),
                headers: {
                    'content-type': 'application/json',
                },
            });
            setMessage('');
        } catch (err) {
            console.error('Message sending error:', err);
            setError('메시지를 전송하는데 실패했습니다.');
        }
    };

    useEffect(() => {
        console.log('유저 챗 컴포넌트 마운트 확인:', {
            userName,
            userRating,
            title,
            startDate,
            endDate,
            initialRoomId,
            opponentKakaoId,
            postId,
        });
    }, [
        userName,
        userRating,
        title,
        startDate,
        endDate,
        initialRoomId,
        opponentKakaoId,
        postId,
    ]);

    const createOrGetChatRoom = useCallback(async () => {
        console.log('createOrGetChatRoom 호출됨', { opponentKakaoId, kakaoId });

        if (!opponentKakaoId) {
            console.error('상대방 카카오 ID가 없습니다.');
            setError('상대방 정보가 없습니다.');
            return;
        }

        if (!kakaoId) {
            console.error('내 카카오 ID가 없습니다. 로그인이 필요합니다.');
            setError('로그인이 필요합니다.');
            return;
        }

        try {
            setIsLoading(true);

            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL || 'http://localhost:3000';

            const response = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        opponentKakaoId: opponentKakaoId,
                    }),
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                throw new Error('채팅방을 생성하는데 실패했습니다.');
            }

            const data = await response.json();
            setRoomId(data.roomId);
            return data.roomId;
        } catch (error) {
            console.error('채팅방 생성 오류:', error);
            setError('채팅방을 생성하는데 실패했습니다.');
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
                <button
                    className="flex h-6 w-6 cursor-pointer items-center justify-center"
                    onClick={onClose}
                    aria-label="창 닫기"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="inline-flex items-center gap-1">
                    <SheetTitle className="m-0 text-[15px] font-semibold text-black">
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
                    className="flex h-6 w-6 items-center justify-center"
                    aria-label="MoreHorizontal options"
                >
                    <MoreHorizontal className="h-5 w-5 cursor-pointer text-[#333333]" />
                </button>
            </SheetHeader>

            <section className="flex w-full flex-col gap-2.5 border-b px-5 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex w-[365px] flex-col gap-[3px]">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <SheetDescription className="m-0 text-sm font-normal whitespace-nowrap text-[#666666]">
                                {`${startDate} - ${endDate}`}
                            </SheetDescription>
                        </div>
                    </div>
                    <Button className="px-[30px] py-2" onClick={onParticipate}>
                        참여하기
                    </Button>
                </div>
            </section>

            <section className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <p>로딩 중...</p>
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-red-500">
                        <p>{error}</p>
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
                            <div className="mb-2 text-xs text-gray-500">
                                Debug: isLoading=
                                {isLoading ? 'true' : 'false'}, roomId=
                                {roomId ? roomId.toString() : 'undefined'},
                                kakaoId={kakaoId || 'undefined'},
                                opponentKakaoId={opponentKakaoId}
                            </div>

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
