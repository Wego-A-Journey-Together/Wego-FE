// 임시 TODO: 실제 채팅 데이터 불러오기
type Message = {
    messageId: number;
    text: string;
    messageFrom: 'user' | 'writer';
    timestamp: string;
};

// 테스트용 채팅 데이터
const testMessages: Message[] = [
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
    {
        messageId: 3,
        text: '여행 일정이 어떻게 되나요? 그리고 참가비에는 어떤 것들이 포함되어 있나요?',
        messageFrom: 'user',
        timestamp: '14:35',
    },
    {
        messageId: 4,
        text: '일정은 게시글에 적힌 대로 3박 4일이고, 참가비에는 숙박비와 일부 식사비가 포함되어 있습니다. 교통비는 별도입니다.',
        messageFrom: 'writer',
        timestamp: '14:40',
    },
];

export default function ChatList() {
    return (
        <div className="flex flex-col">
            {testMessages.map((chatData) => (
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
