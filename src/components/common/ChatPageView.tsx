'use client';

import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@stomp/stompjs';
import { ChevronLeft, MoreHorizontal, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChatNotice from './ChatNotice';
import ChatRoom from './ChatRoom';

interface ChatPageViewProps {
    userName: string;
    userRating: number;
    title: string;
    startDate: string;
    endDate: string;
    onClose?: () => void;
    onParticipate?: () => void;
    roomId?: number;
    kakaoId?: string;
    messages?: Array<{
        roomId: number;
        message: string;
        sentAt: string;
        senderId?: string;
        nickname?: string;
    }>;
    onSendMessage?: (message: string) => void;
    skipRoomDataFetch?: boolean;
}

interface RoomData {
    roomId: number;
    opponentNickname: string;
    opponentRating: number;
    lastMessage: string;
    unreadCount: number;

    gathering?: {
        title: string;
        startDate: string;
        endDate: string;
    };
}

export default function ChatPageView({
    userName,
    userRating,
    // title,
    // startDate,
    // endDate,
    onClose,
    // onParticipate,
    roomId,
    kakaoId,
    messages = [],
    skipRoomDataFetch = false,
    onSendMessage,
}: ChatPageViewProps) {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [wsToken, setWsToken] = useState<string | null>(null);
    const stompClient = useRef<Client | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const userKakaoId = kakaoId || (params.kakaoId as string);
    const roomIdValue = roomId || parseInt(params.roomId as string, 10);

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

    useEffect(() => {
        if (!roomIdValue || skipRoomDataFetch) return;
        const fetchRoomData = async () => {
            try {
                setLoading(true);
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL ||
                    'http://localhost:3000';
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomIdValue}`,
                    {
                        credentials: 'include',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch room data: ${response.status}`,
                    );
                }

                const data = await response.json();
                setRoomData(data);
            } catch (err) {
                console.error('Error fetching room data:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [roomIdValue, skipRoomDataFetch]);

    // 메시지 전송을 위한 콜백 추가
    const sendMessage = useCallback(
        (message: string) => {
            if (
                !message.trim() ||
                !roomIdValue ||
                !stompClient.current?.connected ||
                !wsToken
            ) {
                return;
            }

            try {
                stompClient.current.publish({
                    destination: '/app/chat.sendMessage',
                    headers: {
                        Authorization: `Bearer ${wsToken}`,
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        roomId: roomIdValue,
                        message: message.trim(),
                    }),
                });
            } catch (err) {
                console.error('Message sending error:', err);
                setError(
                    `메시지 전송 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`,
                );
            }
        },
        [roomIdValue, wsToken],
    );

    // 메시지 전송 함수
    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        if (onSendMessage) {
            onSendMessage(newMessage);
            setNewMessage('');
        } else if (
            stompClient.current &&
            stompClient.current.connected &&
            wsToken
        ) {
            // 직접 메시지 전송 처리
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    // 엔터키 처리
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // WebSocket 연결 효과 추가
    useEffect(() => {
        if (!wsToken || !roomIdValue) return;

        let mounted = true;
        const WS_URL = 'wss://gateway.wego-travel.click/ws/chat/websocket';

        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: {
                Authorization: `Bearer ${wsToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // 연결 성공 콜백
        client.onConnect = function () {
            if (!mounted) return;
            stompClient.current = client;

            // 채팅방 구독 추가
            client.subscribe(`/topic/chatroom/${roomIdValue}`, function () {
                if (!mounted) return;
                // 메시지 처리 로직은 ChatRoom 컴포넌트에서 처리
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

        client.onWebSocketError = () => {
            if (!mounted) return;
            setError('WebSocket 연결 실패: 서버에 연결할 수 없습니다.');
        };

        // 연결
        client.activate();

        // 언마운트 시 정리
        return () => {
            mounted = false;
            if (client.connected) {
                client.deactivate();
            }
            stompClient.current = null;
        };
    }, [wsToken, roomIdValue]);

    return (
        <div className="bg-background-light flex h-full w-full flex-col border-x-1 border-[#E9E9E9]">
            {/* 채팅창 헤더 */}
            <header className="flex h-[72px] w-full flex-row items-center justify-between border-b px-5 py-2.5">
                <button
                    className="flex h-6 w-6 cursor-pointer items-center justify-center"
                    onClick={onClose}
                    aria-label="뒤로 가기"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="inline-flex items-center gap-1">
                    {/* 유저 아이디 */}
                    <h2 className="m-0 text-[15px] font-semibold text-black">
                        {roomData?.opponentNickname || userName}
                    </h2>

                    <div className="inline-flex items-center gap-1 rounded-[50px] bg-[#ffd8001a] px-2 py-1 text-[#614e03]">
                        <Star className="h-4 w-4 fill-[#FFD800] text-[#FFD800]" />

                        {/* 유저 평점 */}
                        <span className="text-xs font-medium">
                            {roomData?.opponentRating || userRating}
                        </span>
                    </div>
                </div>

                <button
                    className="flex h-6 w-6 items-center justify-center"
                    aria-label="MoreHorizontal options"
                >
                    <MoreHorizontal className="h-5 w-5 cursor-pointer text-[#333333]" />
                </button>
            </header>

            {/* 게시글 제목, 상태, 참여하기 버튼 섹션: 채팅 페이지에서는 게시글 정보를 불러올 수 없어 미구현 */}
            {/* <section className="flex w-full flex-col gap-2.5 border-b px-5 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 flex-col gap-[3px] pr-2">
                        <h2 className="text-base font-semibold">
                            {roomData?.gathering?.title || title}
                        </h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <p className="m-0 text-sm font-normal whitespace-nowrap text-[#666666]">
                                {`${roomData?.gathering?.startDate || startDate} - ${roomData?.gathering?.endDate || endDate}`}
                            </p>
                        </div>
                    </div>

                    <Button className="px-[30px] py-2" onClick={onParticipate}>
                        참여하기
                    </Button>
                </div>
            </section> */}

            {/* 채팅 말풍선 섹션 */}
            <section className="w-full flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <LoadingThreeDots />
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-red-500">
                        {error}
                    </div>
                ) : roomIdValue ? (
                    <ChatRoom
                        roomId={roomIdValue}
                        kakaoId={userKakaoId}
                        messages={messages}
                        onSendMessage={sendMessage}
                    />
                ) : (
                    <ChatNotice />
                )}
            </section>

            {/* 메시지 입력 영역 추가 */}
            <div className="border-t p-4">
                <div className="w-full rounded-xl border-solid bg-[#f9f9f9]">
                    <div className="p-5">
                        <div className="flex flex-col gap-10">
                            <Input
                                placeholder="메세지를 입력하세요"
                                className="border-none bg-transparent text-base leading-[20.8px] font-normal text-black shadow-none placeholder:text-[#999999] focus-visible:ring-0"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex w-full items-center justify-end gap-2">
                                <Button
                                    className="px-5 py-2"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    전송
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
