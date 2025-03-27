import ChatPreview from '@/components/chat/ChatPreview';

export default function Chat() {
    // 임시데이터
    const chatData = [
        {
            id: 1,
            name: '귀여운동행자',
            location: '제주도',
            time: '5분전',
            message:
                '안녕하세요. 저도 같은 일정에 제주도 방문 예정이라 연락드렸습니다. 저는 아이ㅣ어아이',
            unreadChat: 1,
            userIcon: '',
        },
        {
            id: 2,
            name: '귀여운동행자',
            location: '제주도',
            time: '5분전',
            message:
                '안녕하세요. 저도 같은 일정에 제주도 방문 예정이라 연락드렸습니다. 저는 아이ㅣ어아이',
            unreadChat: 99,
            userIcon: '',
        },
        {
            id: 3,
            name: '귀여운동행자',
            location: '제주도',
            time: '24.10.12',
            message:
                '안녕하세요. 저도 같은 일정에 제주도 방문 예정이라 연락드렸습니다. 저는 아이ㅣ어아이',
            unreadChat: 0,
            userIcon: '',
        },
        {
            id: 4,
            name: '귀여운동행자',
            location: '제주도',
            time: '24.10.12',
            message:
                '안녕하세요. 저도 같은 일정에 제주도 방문 예정이라 연락드렸습니다. 저는 아이ㅣ어아이',
            unreadChat: 0,
            userIcon: '',
        },
        {
            id: 5,
            name: '귀여운동행자',
            location: '제주도',
            time: '24.10.12',
            message:
                '안녕하세요. 저도 같은 일정에 제주도 방문 예정이라 연락드렸습니다. 저는 아이ㅣ어아이',
            unreadChat: 0,
            userIcon: '',
        },
    ];

    return (
        <>
            <div className="flex min-h-screen w-full justify-center bg-[#F5F6F7]">
                <section className="bg-background-light flex w-full max-w-[580px] flex-col border-x-1 border-[E9E9E9]">
                    <header className="px-5 pt-10 pb-[50px]">
                        <h1 className="text-xl font-semibold">대화 목록</h1>
                    </header>

                    {/* 채팅 목록 */}
                    <div className="overflow-y-auto px-4">
                        <ul className="list-none space-y-[30px] p-0">
                            {chatData.map((chat) => (
                                <li key={chat.id}>
                                    <ChatPreview chat={chat} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
}
