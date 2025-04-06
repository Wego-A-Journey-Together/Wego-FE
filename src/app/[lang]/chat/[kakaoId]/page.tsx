import ChatPreview from '@/components/chat/ChatPreview';
import getCurrentUser from '@/lib/getCurrentUser';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = { kakaoId: string };

interface ChatPageProps {
    params: Params;
}

// 채팅 데이터 임시 타입
interface ChatRoom {
    roomId: number;
    name: string;
    location: string;
    time: string;
    message: string;
    unreadChat: number;
    userIcon: string;
}

export default async function Chat({ params }: ChatPageProps) {
    const kakaoId = params.kakaoId;
    const currentUser = await getCurrentUser();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    let chatData: ChatRoom[] = [];

    // 현재 사용자와 채팅창 URL의 kakaoId가 일치하는지 확인
    if (!currentUser || currentUser.kakaoId !== kakaoId) {
        notFound();
    }

    try {
        const res = await fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`);
        if (!res.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        chatData = await res.json();
    } catch (error) {
        console.error('채팅 데이터 불러오는데 실패했습니다.', error);
        chatData = [
            {
                roomId: 1,
                name: '임시데이터',
                location: '서울',
                time: '2025-04-06',
                message: '안녕하세요!',
                unreadChat: 3,
                userIcon: '/icon/profile/defaultProfile.svg',
            },
        ];
    }

    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main className="bg-background-light mx-auto h-screen max-w-[580px] border-x-1 border-[#E9E9E9]">
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
