import Image from 'next/image';

interface ChatProps {
    chat: {
        roomId: number;
        name: string;
        location: string;
        time: string;
        message: string;
        unreadChat: number;
        userIcon: string;
    };
}

export default function ChatPreview({ chat }: ChatProps) {
    return (
        <article className="flex h-[60px] w-full cursor-pointer items-center px-2">
            {/* 좌측 대화 프로필 이미지 */}
            <div className="mr-3.5 h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image
                    src={chat.userIcon || '/placeholder-avatar.png'}
                    alt={chat.name}
                    width={60}
                    height={60}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[7px]">
                {/* 중앙 유저 아이디, 지역 */}
                <div className="flex items-center">
                    <div className="text-base font-semibold">{chat.name}</div>
                    <div className="mx-[6px] text-base font-semibold text-[#333333]">
                        ·
                    </div>
                    <div className="text-xs font-medium text-[#666666]">
                        {chat.location}
                    </div>
                </div>
                {/* 가장 최근 메세지 미리보기 */}
                <p className="max-w-[360px] truncate text-sm text-gray-600">
                    {chat.message}
                </p>
            </div>

            {/* 우측 메세지 도착 시간 및 안읽은 메세지 뱃지 */}
            <div className="ml-2 flex flex-col items-end">
                <p className="mb-3 text-xs text-[#666666]">{chat.time}</p>
                {chat.unreadChat > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF4D4D] px-1.5 text-xs font-medium text-white">
                        {chat.unreadChat}
                    </span>
                )}
            </div>
        </article>
    );
}
