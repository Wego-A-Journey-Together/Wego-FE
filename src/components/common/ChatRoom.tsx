'use client';

import { useEffect, useRef } from 'react';

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
    messages?: Array<{
        roomId: number;
        message: string;
        sentAt: string;
        senderId?: string;
        nickname?: string;
    }>;
    isLoading?: boolean;
    error?: string | null;
    onSendMessage?: (message: string) => void; // 이 속성 추가
}

export default function ChatRoom({
    kakaoId,
    messages: initialMessages = [],
    isLoading = false,
    error = null,
}: ChatRoomProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 메시지 데이터 변환
    const formattedMessages: Message[] = initialMessages.map((msg, index) => ({
        messageId: index,
        text: msg.message || '',
        messageFrom: kakaoId && msg.senderId === kakaoId ? 'writer' : 'user',
        timestamp: formatTime(msg.sentAt || new Date().toISOString()),
    }));

    // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [initialMessages]);

    // 로딩 중일 때 표시
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingThreeDots />
            </div>
        );
    }

    // 에러가 있을 경우
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
                {formattedMessages.length === 0 ? (
                    <ChatNotice />
                ) : (
                    <div className="flex flex-col gap-4">
                        {formattedMessages.map((msg) => {
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
        </div>
    );
}
