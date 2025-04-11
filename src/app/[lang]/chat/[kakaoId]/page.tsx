import ChatPreview from '@/components/chat/ChatPreview';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface ChatRoom {
    roomId: number;
    opponentNickname: string;
    lastMessage: string;
    unreadCount: number;
    time?: string;
    location?: string;
    userIcon?: string;
}

interface ChatPageProps {
    params: Promise<{
        kakaoId: string;
        lang: string;
    }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { kakaoId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    if (!accessToken || !NEXT_PUBLIC_NEST_BFF_URL) {
        redirect('/');
    }

    const res = await fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return (
            <div className="py-10 text-center text-red-500">
                서버 오류가 발생했습니다 ({res.status})
            </div>
        );
    }

    const chatData: ChatRoom[] = await res.json();

    // 자신의 대화 목록만 접근 가능
    const currentUserKakaoId = cookieStore.get('kakaoId')?.value;
    if (!currentUserKakaoId || currentUserKakaoId !== kakaoId) {
        redirect('/');
    }

    const HEADER_HEIGHT = 72;
    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main
                className="bg-background-light mx-auto max-w-[580px] border-x-1 border-[#E9E9E9]"
                style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            >
                <header className="px-5 pt-10 pb-[50px]">
                    <h1 className="text-xl font-semibold">대화 목록</h1>
                </header>

                <div className="overflow-y-auto px-4">
                    {chatData.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            아직 대화 목록이 없습니다.
                        </div>
                    ) : (
                        <ul className="list-none space-y-[30px] p-0">
                            {chatData.map((chat) => (
                                <li key={chat.roomId}>
                                    <Link
                                        href={`/chat/${kakaoId}/rooms/${chat.roomId}`}
                                    >
                                        <ChatPreview
                                            chat={{
                                                roomId: chat.roomId,
                                                name: chat.opponentNickname,
                                                location: chat.location || '',
                                                time: chat.time || '',
                                                message: chat.lastMessage,
                                                unreadChat: chat.unreadCount,
                                                userIcon: chat.userIcon || '',
                                            }}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </>
    );
}
