'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

import LoadingThreeDots from './LoadingThreeDots';

type Message = {
    messageId: number;
    text: string;
    messageFrom: 'user' | 'writer';
    timestamp: string;
};

interface ChatRoomProps {
    roomId: number;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // 메세지 불러오기 api
    useEffect(() => {
        async function fetchMessages() {
            try {
                setIsLoading(true);
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL;
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms/${roomId}/messages`,
                );

                if (!response.ok) {
                    throw new Error('메시지를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setMessages(data);
            } catch (err) {
                console.error('메시지 로딩 오류:', err);
                setError('메시지를 불러오는데 문제가 발생했습니다.');

                // 임시 데이터 db에 데이터 생기면 제거
                setMessages([
                    {
                        messageId: 1,
                        text: '안녕하세요! 이 여행에 관심이 있어요.',
                        messageFrom: 'user',
                        timestamp: '14:30',
                    },
                    {
                        messageId: 2,
                        text: '안녕하세요! 관심 가져주셔서 감사합니다. 어떤 점이 궁금하신가요?',
                        messageFrom: 'writer',
                        timestamp: '14:32',
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMessages();
    }, [roomId]);

    // 메세지 보내기
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            setIsSending(true);
            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL;

            // 전송시간 데이터
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;

            // 보낸 메세지 데이터
            const tempMessage: Message = {
                messageId: Date.now(),
                text: newMessage,
                messageFrom: 'writer',
                timestamp: currentTime,
            };

            setMessages((prev) => [...prev, tempMessage]);
            setNewMessage('');

            // 전송 api
            const response = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: newMessage,
                        messageFrom: 'writer',
                        timestamp: currentTime,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('메시지 전송에 실패했습니다.');
            }
        } catch (err) {
            console.error('메시지 전송 오류:', err);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (isLoading) {
        return <LoadingThreeDots />;
    }

    if (error && messages.length === 0) {
        return (
            <div className="flex justify-center p-4 text-red-500">{error}</div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto">
                {messages.map((chatData) => (
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
                                <div className="text-base leading-[20.8px] font-medium text-black">
                                    {chatData.text}
                                </div>
                            </div>
                            <div className="text-xs leading-[21px] font-normal whitespace-nowrap text-[#333333]">
                                {chatData.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 채팅 입력 */}
            <div className="flex w-full flex-col items-center justify-center gap-2.5 border-t bg-white px-2.5 py-5">
                <div className="w-full rounded-xl border-solid bg-[#f9f9f9]">
                    <div className="p-5">
                        <div className="flex flex-col gap-10">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="메세지를 입력하세요"
                                className="border-none bg-transparent text-base leading-[20.8px] font-normal text-[#999999] shadow-none focus-visible:ring-0"
                                disabled={isSending}
                            />
                            <div className="flex w-full items-center justify-end gap-2">
                                <Button
                                    onClick={sendMessage}
                                    disabled={isSending || !newMessage.trim()}
                                    className="px-5 py-2"
                                >
                                    {isSending ? '전송 중...' : '전송'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
