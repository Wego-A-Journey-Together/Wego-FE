'use client';

import { cn } from '@/lib';
import { useState } from 'react';

const tabItems = [
    '상세 정보',
    '동행지 위치',
    '멤버 소개',
    '댓글',
    '리뷰',
] as const;

type TabItem = (typeof tabItems)[number];

export default function Tab() {
    const [selectedTab, setSelectedTab] = useState<TabItem>(tabItems[0]);

    const handleChangeTab = (idx: number) => {
        setSelectedTab(tabItems[idx]);
    };
    return (
        <div
            className={`flex gap-7.5 text-lg leading-loose font-semibold text-gray-400`}
        >
            {tabItems.map((tab, idx) => {
                return (
                    <div
                        key={idx}
                        // 선택되면 커서 포인터 해제 하는게 좋을 것 같아서 넣었습니다.
                        className={cn(
                            `cursor-pointer transition-all duration-300`,
                            selectedTab === tab &&
                                `border-sky-blue text-sky-blue cursor-default border-b-2`,
                        )}
                        onClick={() => handleChangeTab(idx)} // idx 를
                    >
                        {tab}
                    </div>
                );
            })}
        </div>
    );
}
