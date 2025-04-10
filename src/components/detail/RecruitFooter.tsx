'use client';

import UserChat from '@/components/common/userChat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DetailPost } from '@/types/DetailPost';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function RecruitFooter({ post }: { post: DetailPost }) {
    const [showChat, setShowChat] = useState(false);
    const [creatorKakaoId, setCreatorKakaoId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCreatorInfo = async () => {
            try {
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL ||
                    'http://localhost:3000';
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${post.id}`,
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch gathering details');
                }

                const data = await response.json();
                console.log('Gathering creator info:', data.creator);

                if (data.creator && data.creator.kakaoId) {
                    // Convert to string as the API might return it as a number
                    setCreatorKakaoId(String(data.creator.kakaoId));
                    console.log(
                        'Set creator kakaoId:',
                        String(data.creator.kakaoId),
                    );
                }
            } catch (error) {
                console.error('Error fetching creator info:', error);
            }
        };

        fetchCreatorInfo();
    }, [post.id]);

    const toggleChat = () => {
        setShowChat((prev) => !prev);
    };

    return (
        <>
            <footer className="fixed right-0 bottom-0 left-0 z-40 w-full bg-white py-5 drop-shadow-2xl">
                <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4">
                    <div className="flex items-center gap-1.5">
                        {new Date() < new Date(post.filter.deadlineDate) ? (
                            <Badge>동행구함</Badge>
                        ) : (
                            <Badge variant="disable">동행마감</Badge>
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
                    <UserChat
                        userName={post.userName}
                        userRating={post.userRating}
                        title={post.title}
                        startDate={post.filter.startDate}
                        endDate={post.filter.endDate}
                        onClose={toggleChat}
                        postId={post.id}
                        opponentKakaoId={creatorKakaoId || null}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
