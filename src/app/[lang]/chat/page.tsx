import ChatPreview from '@/components/chat/ChatPreview';
import Link from 'next/link';

// 데이터 생기면 파일도 삭제
import { chatData } from './tempData';

export default function Chat() {
    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main className="mx-auto w-full max-w-[580px] bg-white">
                <header className="px-5 pt-10 pb-[50px]">
                    <h1 className="text-xl font-semibold">대화 목록</h1>
                </header>

                {/* 채팅 목록 */}
                <div className="overflow-y-auto px-4">
                    <ul className="list-none space-y-[30px] p-0">
                        {chatData.map((chat) => (
                            <li key={chat.id}>
                                <Link href={`/chat/${chat.id}`}>
                                    <ChatPreview chat={chat} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    );
}
