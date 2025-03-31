import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function Comments() {
    const messages = [
        {
            id: 1,
            title: '혹시 3.24일 점심만 같이 하는 건 어떠세요?',
            timestamp: '2025.03.24 오후 8:45',
            status: '동행마감',
            subtitle: '제주도 동행 구합니다',
            isGroupOpen: false,
        },
        {
            id: 2,
            title: '혹시 3.24일 점심만 같이 하는 건 어떠세요?',
            timestamp: '2025.03.24 오후 8:45',
            status: '동행마감',
            subtitle: '제주도 동행 구합니다',
            isGroupOpen: true,
        },
        {
            id: 3,
            title: '혹시 3.24일 점심만 같이 하는 건 어떠세요?',
            timestamp: '2025.03.24 오후 8:45',
            status: '동행마감',
            subtitle: '제주도 동행 구합니다',
            isGroupOpen: false,
        },
        {
            id: 4,
            title: '혹시 3.24일 점심만 같이 하는 건 어떠세요?',
            timestamp: '2025.03.24 오후 8:45',
            status: '동행마감',
            subtitle: '제주도 동행 구합니다',
            isGroupOpen: true,
        },
    ];

    return (
        <div className="w-full">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className="flex items-start border-b border-[#e9e9e9] py-4"
                >
                    <Checkbox className="mt-1 h-5 w-5" />

                    <div className="ml-3 flex flex-col">
                        <div className="text-base font-medium">
                            {message.title}
                        </div>

                        <div className="mt-1 text-xs text-[#333333]">
                            {message.timestamp}
                        </div>

                        <div className="mt-2 flex items-center">
                            <Badge
                                variant={
                                    message.isGroupOpen ? 'default' : 'disable'
                                }
                            >
                                {message.isGroupOpen ? '모집 중' : '모집 마감'}
                            </Badge>

                            <div className="ml-2 text-sm font-semibold text-[#666666]">
                                {message.subtitle}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-between pt-5">
                <div className="flex items-center">
                    <Checkbox className="h-5 w-5" />
                    <span className="ml-2 text-sm text-black">전체선택</span>
                </div>

                <Button
                    variant="outline"
                    className="h-10 w-[100px] rounded-lg border border-solid border-[#e9e9e9] bg-white"
                >
                    <span className="text-sm text-[#666666]">삭제</span>
                </Button>
            </div>
        </div>
    );
}
