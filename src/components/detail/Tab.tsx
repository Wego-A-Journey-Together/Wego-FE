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
            className={`bg-custom-light relative z-50 flex gap-7.5 text-lg leading-loose font-semibold text-gray-400`}
        >
            {tabItems.map((tab, idx) => {
                return (
                    <div
                        key={idx}
                        // 선택되면 커서 포인터 해제 하는게 좋을 것 같아서 넣었습니다.( 선택시 액션 또 발생하면 안좋을 것 같음 )
                        // select-none : 탭인데 클릭시에 선택되는 문제가 있어서 넣었습니다.
                        className={cn(
                            `cursor-pointer transition-all duration-300 select-none`,
                            selectedTab === tab &&
                                `border-sky-blue text-sky-blue cursor-default border-b-2`,
                        )}
                        onClick={() => handleChangeTab(idx)}
                    >
                        {tab}
                    </div>
                );
            })}
        </div>
    );
}
