'use client';

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

    if (isLoading) {
        return <LoadingThreeDots />;
    }

    if (error && messages.length === 0) {
        return (
            <div className="flex justify-center p-4 text-red-500">{error}</div>
        );
    }

    return (
        <div className="flex flex-col">
            {messages.map((chatData) => (
                <div
                    key={chatData.messageId}
                    className={`mb-4 flex ${
                        chatData.messageFrom === 'user'
                            ? 'justify-end pr-5'
                            : 'justify-start pl-5'
                    }`}
                >
                    {chatData.messageFrom === 'writer' && (
                        <div className="mr-2.5 h-[30px] w-[30px] rounded-full bg-gray-200"></div>
                    )}
                    <div
                        className={`flex items-end gap-1.5 ${
                            chatData.messageFrom === 'user'
                                ? 'flex-row-reverse'
                                : 'flex-row'
                        }`}
                    >
                        <div
                            className={`inline-flex max-w-xs items-center justify-center rounded-2xl p-2.5 ${
                                chatData.messageFrom === 'user'
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
    );
}
