'use client';

import Tab from '@/components/common/Tab';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { TrendingPost } from '../../../public/data/trending';

export default function GroupCreateByUser({
    posts,
}: {
    posts: TrendingPost[];
}) {
    const [selectedTabs, setSelectedTabs] = useState<Record<number, string>>(
        {},
    );

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
        members: post.participants,
    }));

    return (
        <>
            <div className="flex w-full flex-col gap-5">
                {groupPosts.map((post) => {
                    const currentTab = selectedTabs[post.id] || '확정 대기중';
                    return (
                        <div
                            key={post.id}
                            className="relative overflow-visible rounded-xl bg-[#f5f6f7] p-[30px] shadow-none"
                        >
                            <div className={`flex flex-col`}>
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
                                <div
                                    className={`mt-4 h-px w-full bg-[#D9D9D9]`}
                                />
                                {/*참여 확정 ui*/}
                                <section>
                                    <Tab
                                        className={
                                            'mt-4 text-base leading-relaxed'
                                        }
                                        tabItems={['확정 대기중', '참여 확정']}
                                        selectedTab={currentTab}
                                        onChange={(idx) => {
                                            const newTab = [
                                                '확정 대기중',
                                                '참여 확정',
                                            ][idx];
                                            setSelectedTabs({
                                                ...selectedTabs,
                                                [post.id]: newTab,
                                            });
                                        }}
                                    />
                                </section>
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
                    );
                })}
            </div>
        </>
    );
}
