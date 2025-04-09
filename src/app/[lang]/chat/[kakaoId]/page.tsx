import ChatPreview from '@/components/chat/ChatPreview';
import getCurrentUser from '@/lib/getCurrentUser';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = { kakaoId: string };

interface ChatPageProps {
    params: Promise<Params>;
}

// 백엔드 API 응답 형식에 맞게 채팅방 타입 수정, 추가
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

    // 디버깅용
    console.log('사용자 정보 확인:', {
        currentUser: currentUser,
        kakaoIdFromURL: kakaoId,
        kakaoIdType: typeof kakaoId,
        currentUserIdType: typeof currentUser?.kakaoId,
    });

    // kakaoId 타입 변환 - 문자열로 확실하게 변환
    const currentUserKakaoId = currentUser?.kakaoId?.toString();
    const requestedKakaoId = kakaoId?.toString();

    // 더 유연한 비교 (숫자 문자열로 변환 후 비교)
    if (
        !currentUser ||
        !currentUserKakaoId ||
        currentUserKakaoId !== requestedKakaoId
    ) {
        console.log({
            current: currentUserKakaoId,
            requested: requestedKakaoId,
            isEqual: currentUserKakaoId === requestedKakaoId,
        });
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
            },
        });

        if (!res.ok) {
            console.error('API 응답 오류:', res.status, res.statusText);
            throw new Error(
                `데이터를 불러오는데 실패했습니다. 상태 코드: ${res.status}`,
            );
        }
        const responseData = await res.json();
        console.log('API 응답 데이터:', responseData);

        // API 응답이 배열인지 확인
        chatData = Array.isArray(responseData) ? responseData : [];

        // 필요한 경우 데이터 가공 (ChatPreview 컴포넌트에 맞게)
        chatData = chatData.map((room) => ({
            ...room,
            name: room.opponentNickname,
            message: room.lastMessage,
            unreadChat: room.unreadCount,
            // 정보가 없는 경우 빈 값으로
            time: room.time || '',
            location: room.location || '',
            userIcon: room.userIcon || '',
        }));
    } catch (error) {
        console.error('채팅 데이터 불러오는데 실패했습니다.', error);
        // 에러 발생 시 빈 배열로 처리하고 계속 진행 (notFound 대신)
        chatData = [];
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
