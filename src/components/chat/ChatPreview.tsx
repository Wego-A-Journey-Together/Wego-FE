import Image from 'next/image';

interface ChatProps {
    chatData: {
        roomId: number;
        name: string;
        lastMessage: string;
        unreadChat: number;
        statusMessage?: string; // 원래는 Location이나, statusMessage로 대체
        thumbnailUrl: string;
    };
}

export default function ChatPreview({ chatData }: ChatProps) {
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
                <div className="flex items-center">
                    {/* 유저이름 */}
                    <div className="text-base font-semibold">
                        {chatData.name}
                    </div>

                    {/* 유저 상태 메세지 -> 피그마대로면 원래 상대의 선호 지역 정보이나, 저희 프로필 설정에는 지역 정보가 없습니다. */}
                    <div className="mx-[6px] text-base font-semibold text-[#333333]">
                        ·
                    </div>
                    <div className="text-xs font-medium text-[#666666]">
                        {/* TODO 추후 지역 정보로 변경 */}
                        {chatData.statusMessage || '상태 메시지가 없습니다'}
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
