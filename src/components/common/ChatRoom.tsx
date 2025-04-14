'use client';

import { useEffect, useRef } from 'react';

import ChatNotice from './ChatNotice';
import LoadingThreeDots from './LoadingThreeDots';

/** #P101 성능: 시간 포맷팅 함수의 메모이제이션 검토 필요 */
// 시간 포맷팅 함수
const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

/** #T102 타입 안정성: Message 타입을 별도로 분리하여 재사용성 향상 필요 */
// UI용 메시지 타입
type Message = {
    messageId: number;
    text: string;
    messageFrom: 'user' | 'writer';
    timestamp: string;
};

/** #T103 타입 안정성: ChatRoomProps 인터페이스에 필드 유효성 제약 추가 필요 */
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

/** #P104 성능: 불필요한 리렌더링 방지를 위해 React.memo 적용 검토 필요 */
export default function ChatRoom({
    kakaoId,
    messages: initialMessages = [],
    isLoading = false,
    error = null,
}: ChatRoomProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /** #P105 성능: 메시지 데이터 변환 로직 최적화 필요 */
    // 메시지 데이터 변환
    const formattedMessages: Message[] = initialMessages.map((msg, index) => ({
        messageId: index,
        text: msg.message || '',
        messageFrom: kakaoId && msg.senderId === kakaoId ? 'writer' : 'user',
        timestamp: formatTime(msg.sentAt || new Date().toISOString()),
    }));

    /** #U106 사용자 경험: 스크롤 동작에 대한 사용자 설정 옵션 제공 필요 */
    // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [initialMessages]);

    /** #A107 접근성: 로딩 상태에 대한 ARIA 레이블 추가 필요 */
    // 로딩 중일 때 표시
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingThreeDots />
            </div>
        );
    }

    /** #E108 에러처리: 구체적인 에러 메시지와 재시도 옵션 제공 필요 */
    // 에러가 있을 경우
    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    /** #A109 접근성: 채팅방 구조에 대한 ARIA 랜드마크와 레이블 추가 필요 */
    return (
        <div className="flex h-full flex-col">
            {/* 메시지 목록 */}
            <div className="custom-scrollbar flex-1 overflow-y-auto pr-4 pb-4">
                {formattedMessages.length === 0 ? (
                    <ChatNotice />
                ) : (
                    /** #P110 성능: 긴 메시지 목록에 대한 가상화 적용 검토 필요 */
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
