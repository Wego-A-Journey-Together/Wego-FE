import ChatPreview from '@/components/chat/ChatPreview';
import getCurrentUser from '@/lib/getCurrentUser';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = { kakaoId: string };

interface ChatPageProps {
    params: Promise<Params>;
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
    const { kakaoId } = await params;
    const currentUser = await getCurrentUser();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    let chatData: ChatRoom[] = [];

    // 디버깅용 상세 내용들 확인용
    console.log('사용자 정보 확인:', {
        currentUser: currentUser,
        kakaoIdFromURL: kakaoId,
        kakaoIdType: typeof kakaoId,
        currentUserIdType: typeof currentUser?.kakaoId,
    });

    // kakaoId 타입 변환
    const currentUserKakaoId = currentUser?.kakaoId?.toString();

    if (!currentUser || currentUserKakaoId !== kakaoId) {
        console.log({
            current: currentUserKakaoId,
            requested: kakaoId,
            isEqual: currentUserKakaoId === kakaoId,
        });
        notFound();
    }

    try {
        const res = await fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/chat/rooms`, {
            credentials: 'include', // 인증 정보 포함
        });
        if (!res.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        chatData = await res.json();
    } catch (error) {
        console.error('채팅 데이터 불러오는데 실패했습니다.', error);
        notFound();
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
                    {chatData.length === 0 ? (
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
                                        <ChatPreview chat={chat} />
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
