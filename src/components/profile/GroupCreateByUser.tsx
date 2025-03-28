'use client';

import Tab from '@/components/common/Tab';
import ConfirmMember from '@/components/profile/ConfirmMember';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { TrendingPost } from '../../../public/data/trending';

const TABS = ['확정 대기중', '참여 확정'] as const;

export default function GroupCreateByUser({
    posts,
}: {
    posts: TrendingPost[];
}) {
    const [selectedTabs, setSelectedTabs] = useState<Record<number, number>>(
        {},
    );

    const [openTabs, setOpenTabs] = useState<Record<number, boolean>>({});

    const toggleTab = (postId: number) => {
        setOpenTabs((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

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
        location: post.location,
    }));

    return (
        <>
            <div className="flex w-full flex-col gap-5">
                {groupPosts.map((post) => {
                    const currentTabIndex = selectedTabs[post.id] ?? 0;
                    const isOpen = openTabs[post.id] || false;
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
                                <section
                                    className={`mt-4 flex items-center justify-between gap-5`}
                                >
                                    <Tab
                                        className={'text-base leading-relaxed'}
                                        tabItems={TABS}
                                        selectedTab={TABS[currentTabIndex]}
                                        onChange={(idx) => {
                                            setSelectedTabs({
                                                ...selectedTabs,
                                                [post.id]: idx,
                                            });
                                        }}
                                    />
                                    <div
                                        className={'cursor-pointer'}
                                        onClick={() => toggleTab(post.id)}
                                    >
                                        {isOpen ? (
                                            <ChevronUp
                                                size={24}
                                                className="text-[#999999]"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={24}
                                                className="text-[#999999]"
                                            />
                                        )}
                                    </div>
                                </section>
                                {/*승인 완료와 그렇지 않은 멤버 분기*/}
                                {currentTabIndex === 0 ? (
                                    <ConfirmMember
                                        currentTabIndex={currentTabIndex}
                                        members={post.members.filter(
                                            (member) => !member.isApproved,
                                        )}
                                    />
                                ) : (
                                    <ConfirmMember
                                        currentTabIndex={currentTabIndex}
                                        members={post.members.filter(
                                            (member) => member.isApproved,
                                        )}
                                    />
                                )}
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
