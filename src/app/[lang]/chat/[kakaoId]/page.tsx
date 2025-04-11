import ChatPreview from '@/components/chat/ChatPreview';
import getCurrentUser from '@/lib/getCurrentUser';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = { kakaoId: string };

interface ChatPageProps {
    params: Promise<Params>;
}

interface ChatRoom {
    roomId: number;
    opponentNickname: string;
    lastMessage: string;
    unreadCount: number;
    time?: string;
    location?: string;
    userIcon?: string;
}

export default async function Chat({ params }: ChatPageProps) {
    const { kakaoId } = await params;
    const currentUser = await getCurrentUser();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    let chatData: ChatRoom[] = [];
    let errorMessage: string | null = null;

    // kakaoId 타입 변환 - 문자열로 확실하게 변환
    const currentUserKakaoId = currentUser?.kakaoId?.toString();
    const requestedKakaoId = kakaoId?.toString();

    // 더 유연한 비교 (숫자 문자열로 변환 후 비교)
    if (
        !currentUser ||
        !currentUserKakaoId ||
        currentUserKakaoId !== requestedKakaoId
    ) {
        notFound();
    }

    try {
        if (!NEXT_PUBLIC_NEST_BFF_URL) {
            throw new Error('API URL이 설정되지 않았습니다.');
        }

        const res = await fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            errorMessage = `데이터를 불러오는데 실패했습니다.`;
        } else {
            const responseData = await res.json();
            // API 응답이 배열인지 확인
            chatData = Array.isArray(responseData) ? responseData : [];

            // 필요한 경우 데이터 가공 (ChatPreview 컴포넌트에 맞게)
            chatData = chatData.map((room) => ({
                ...room,
                name: room.opponentNickname,
                message: room.lastMessage,
                unreadChat: room.unreadCount,
                time: room.time || '',
                location: room.location || '',
                userIcon: room.userIcon || '',
            }));
        }
    } catch (error) {
        errorMessage = `알 수 없는 오류 발생 ${error}`;
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

                {/* 채팅 목록 */}
                <div className="overflow-y-auto px-4">
                    {errorMessage ? (
                        <div className="py-10 text-center">
                            <p className="mb-2 text-red-500">
                                서버 오류가 발생했습니다
                            </p>
                        </div>
                    ) : chatData.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            아직 대화 목록이 없습니다.
                        </div>
                    ) : (
                        <ul className="list-none space-y-[30px] p-0">
                            {chatData.map((chat, i) => (
                                <li key={i}>
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
