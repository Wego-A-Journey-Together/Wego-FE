import { XIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '../ui/button';

interface Post {
    id: number;
    title: string;
    isGroupOpen: boolean;
    startDate: string;
    endDate: string;
    ageRange: string;
    preferredGender: string;
    currentMembers: number;
    maxMembers: number;
    userName: string;
    imageSrc: string;
    userId: string;
    content: string;
    profileImage: string;
    statusMessage: string;
    rating: number;
    reviewCount: number;
    age: string;
    hashtags: string[];
}

interface MyGroupPostProps {
    posts: Post[];
}

export default function MyGroupPost({ posts }: MyGroupPostProps) {
    const groupPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        status: post.isGroupOpen ? '모집중' : '동행마감',
        date: `${post.startDate} - ${post.endDate}`,
        age: post.ageRange,
        gender: post.preferredGender,
        participants: `${post.currentMembers}명 / ${post.maxMembers}명`,
        host: post.userName,
        image: post.imageSrc,
        isDeleted: false,
    }));

    return (
        <div className="flex w-full flex-col gap-5">
            {groupPosts.map((post) => (
                <div
                    key={post.id}
                    className="relative overflow-visible rounded-xl border-none bg-[#f5f6f7] p-[30px] shadow-none"
                >
                    {/* 게시글 */}
                    <div className="flex w-full items-center gap-5">
                        <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                                className="rounded-lg object-cover"
                                alt={post.title}
                                src={post.image}
                                fill
                                sizes="80px"
                            />
                        </div>
                        <div className="flex flex-grow flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#e5e8ea] px-2 py-1 text-xs font-medium text-[#666666]">
                                    {post.status}
                                </span>
                                <h3 className="text-lg font-semibold text-black">
                                    {post.title}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-[#666666]">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.age}</span>
                                <span>•</span>
                                <span>{post.gender}</span>
                                <span>•</span>
                                <span>{post.participants}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-[#666666]">
                                <span className="font-medium text-black">
                                    {post.host}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                            <Button>임시버튼</Button>
                        </div>
                    </div>

                    {post.isDeleted && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#000000b2]">
                            <button className="absolute top-5 right-5 text-white">
                                <XIcon className="h-[15px] w-[15px]" />
                            </button>
                            <p className="text-center text-sm font-medium text-white">
                                주최자가 동행을 삭제 or 비공개했어요
                                <br />
                                다른 동행에 참여해 보세요! 🙏
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
