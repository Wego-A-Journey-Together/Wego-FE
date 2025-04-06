'use client';

import ChatPageView from '@/components/common/ChatPageView';
import { useParams, useRouter } from 'next/navigation';

export default function ChatPage() {
    const params = useParams();
    const roomId = parseInt(params.roomId as string, 10);
    const router = useRouter();

    // 임시 데이터 - DB에 데이터생기면 API 데이터로 불러오기
    const chatRoomData = {
        userName: '여행 동행자',
        userRating: 4.8,
        title: '서울 여행 같이 가실 분',
        startDate: '2025-05-15',
        endDate: '2025-05-20',
    };

    const handleClose = () => {
        router.back();
    };

    const handleParticipate = () => {
        alert('참여 신청이 완료되었습니다.');
    };

    const HEADER_HEIGHT = 72;
    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main
                className="mx-auto w-full max-w-[580px] bg-white"
                style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            >
                <ChatPageView
                    userName={chatRoomData.userName}
                    userRating={chatRoomData.userRating}
                    title={chatRoomData.title}
                    startDate={chatRoomData.startDate}
                    endDate={chatRoomData.endDate}
                    onClose={handleClose}
                    onParticipate={handleParticipate}
                    roomId={roomId}
                />
            </main>
        </>
    );
}
