'use client';

import UserChat from '@/components/common/userChat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { PostContentProps } from '@/types/PostContent';
import Image from 'next/image';
import { useState } from 'react';

export default function RecruitFooter({ post }: PostContentProps) {
    const [showChat, setShowChat] = useState(false);

    const toggleChat = () => {
        setShowChat((prev) => !prev);
    };

    return (
        <>
            <footer className="fixed right-0 bottom-0 left-0 z-40 w-full bg-white py-5 drop-shadow-2xl">
                <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4">
                    <div className="flex items-center gap-1.5">
                        {new Date() < new Date(post.endDate) ? (
                            <Badge>동행구함</Badge>
                        ) : (
                            <Badge variant={'disable'}>동행마감</Badge>
                        )}
                        <p className="text-base font-semibold text-black">
                            {post.title}
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <Button
                            variant="skyblueOutline"
                            className="h-9 w-[100px]"
                            onClick={toggleChat}
                        >
                            <Image
                                src="/icon/detail/chatIcon.svg"
                                alt="chat"
                                width={16}
                                height={16}
                                className="mr-1.5"
                            />
                            문의하기
                        </Button>
                        <Button className="h-9 w-[150px]">참여하기</Button>
                    </div>
                </div>
            </footer>

            <Sheet open={showChat} onOpenChange={setShowChat}>
                <SheetContent side="right" className="p-0 sm:max-w-[580px]">
                    <UserChat post={post} onClose={toggleChat} />
                </SheetContent>
            </Sheet>
        </>
    );
}
