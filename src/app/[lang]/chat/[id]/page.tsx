import ChatList from '@/components/common/ChatList';

export default function ChatPage() {
    return (
        <>
            <div className="fixed inset-x-0 top-0 -z-10 h-full bg-[#F5F6F7]" />
            <main className="mx-auto h-screen w-full max-w-[580px] bg-white">
                <ChatList />
            </main>
        </>
    );
}
