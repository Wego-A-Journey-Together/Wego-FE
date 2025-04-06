import ChatRoom from '@/components/common/ChatRoom';

interface ChatPageProps {
    params: {
        roomId: string;
    };
}

export default function ChatPage({ params }: ChatPageProps) {
    const roomId = parseInt(params.roomId, 10);

    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main className="mx-auto h-screen w-full max-w-[580px] bg-white">
                <ChatRoom roomId={roomId} />
            </main>
        </>
    );
}
