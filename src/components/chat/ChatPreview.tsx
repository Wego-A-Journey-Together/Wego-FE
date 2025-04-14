import Image from 'next/image';

interface ChatProps {
    chatData: {
        roomId: number;
        name: string;
        lastMessage: string;
        unreadChat: number;
        statusMessage?: string;
        thumbnailUrl: string;
        sentAt: string; // Add sentAt to the interface
    };
}

export default function ChatPreview({ chatData }: ChatProps) {
    const formatTime = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        // 1시간 전 표기 방식
        if (diffHours < 1) {
            return `${diffMinutes}분 전`;
        }
        // 1시간을 넘어가면 시간 단위로 표기
        else if (diffDays < 1) {
            return `${diffHours}시간 전`;
        }
        // 메세지를 받은지 하루가 지나면 날짜를 표기함: YY.MM.DD형식
        else {
            return date
                .toLocaleDateString('ko-KR', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                })
                .replace(/\. /g, '.')
                .slice(0, -1);
        }
    };

    return (
        <article className="flex h-[60px] w-full cursor-pointer items-center px-2">
            <div className="mr-3.5 h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image
                    src="/icon/profile/defaultProfile.svg"
                    alt={chatData.name}
                    width={60}
                    height={60}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[7px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="text-base font-semibold">
                            {chatData.name}
                        </div>
                        <div className="mx-[6px] text-base font-semibold text-[#333333]">
                            ·
                        </div>
                        <div className="text-xs font-medium text-[#666666]">
                            {chatData.statusMessage || '상태 메시지가 없습니다'}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {chatData.sentAt && formatTime(chatData.sentAt)}
                    </div>
                </div>
                <p className="max-w-[360px] truncate text-sm text-gray-600">
                    {chatData.lastMessage}
                </p>
            </div>

            <div className="ml-2 flex flex-col items-end">
                {chatData.unreadChat > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF4D4D] px-1.5 text-xs font-medium text-white">
                        {chatData.unreadChat}
                    </span>
                )}
            </div>
        </article>
    );
}
