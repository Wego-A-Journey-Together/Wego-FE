import ChatPreview from '@/components/chat/ChatPreview';
import getCurrentUser from '@/lib/getCurrentUser';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 데이터 생기면 파일도 삭제
import { chatData } from './tempData';

type Params = { kakaoId: string };

interface ChatPageProps {
    params: Params;
}

export default async function Chat({ params }: ChatPageProps) {
    const { kakaoId } = params;
    const currentUser = await getCurrentUser();

    // 현재 사용자와 채팅창 URL의 kakaoId가 일치하는지 확인
    if (!currentUser || currentUser.kakaoId !== kakaoId) {
        notFound();
    }

    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main className="bg-background-light mx-auto max-w-[580px] border-x-1 border-[#E9E9E9]">
                <header className="px-5 pt-10 pb-[50px]">
                    <h1 className="text-xl font-semibold">대화 목록</h1>
                </header>

                {/* 채팅 목록 */}
                <div className="overflow-y-auto px-4">
                    <ul className="list-none space-y-[30px] p-0">
                        {chatData.map((chat, i) => (
                            <li key={i}>
                                <Link
                                    href={`/chat/${kakaoId}/rooms/${chat.roomId}`}
                                >
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
