'use client';

import Tab from '@/components/common/Tab';
import GroupCreateByUser from '@/components/profile/GroupCreateByUser';
import Comments from '@/components/profile/MyComments';
import MyGroupPost from '@/components/profile/MyGroupPost';
import MyReview from '@/components/profile/MyReview';
import ReceivedReview from '@/components/profile/ReceivedReview';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { useState } from 'react';

import trendingPost from '../../../public/data/trending';

// 카테고리와 탭 정의를 객체로 통합
const CATEGORIES = {
    journey: {
        id: 'journey',
        label: '나의 동행',
        tabs: [
            { id: 'participating', label: '참여중인 동행' },
            { id: 'ended', label: '참여 종료된 동행' },
            { id: 'my', label: '내 동행' },
            { id: 'comments', label: '작성 댓글' },
        ],
    },
    sogam: {
        id: 'sogam',
        label: '동행 소감',
        tabs: [
            { id: 'received', label: '받은 소감' },
            { id: 'writable', label: '작성 가능한 소감' },
            { id: 'written', label: '내가 작성한 소감' },
        ],
    },
} as const;

// 각 탭에서 렌더링할 컴포넌트
const TAB_CONTENTS = {
    journey: {
        participating: (
            <MyGroupPost posts={trendingPost} cancelRecruit={true} />
        ),
        ended: <MyGroupPost posts={trendingPost} />,
        my: <GroupCreateByUser posts={trendingPost} />,
        comments: <Comments />,
    },
    sogam: {
        received: <ReceivedReview />,
        writable: <MyGroupPost posts={trendingPost} />,
        written: <MyReview user={trendingPost[0]} />,
    },
};

type CategoryId = keyof typeof CATEGORIES;

export default function DropDown() {
    const [categoryId, setCategoryId] = useState<CategoryId>('journey');
    const [tabIndex, setTabIndex] = useState(0);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // 현재 선택된 카테고리
    const currentCategory = CATEGORIES[categoryId];

    // 다른 카테고리(드롭다운에 표시할 항목)
    const otherCategories = Object.values(CATEGORIES).filter(
        (cat) => cat.id !== categoryId,
    );

    // 현재 카테고리의 탭 항목들
    const currentTabs = currentCategory.tabs;

    // 현재 선택된 탭
    const currentTab = currentTabs[tabIndex];

    //---------------------------------------------------------
    //탭 관련 로직
    //---------------------------------------------------------

    /*
     * 카테고리 변경시
     * 카테고리 변경, 탭 하이라이트 초기화
     * 팝오버 닫기
     */
    const handleCategoryChange = (newCategoryId: CategoryId) => {
        setCategoryId(newCategoryId);
        setTabIndex(0);
        setIsPopoverOpen(false);
    };

    // 탭 변경 핸들러
    const handleTabChange = (index: number) => {
        setTabIndex(index);
    };

    // 카테고리 표시 텍스트 생성
    const getCategoryDisplayText = (catId: CategoryId) => {
        const category = CATEGORIES[catId];
        return category.label;
    };

    // 현재 탭 컨텐츠 렌더링
    const renderTabContent = () => {
        const tabId =
            currentTab.id as keyof (typeof TAB_CONTENTS)[typeof categoryId];
        return TAB_CONTENTS[categoryId][tabId];
    };

    return (
        <>
            <div className="mb-10 flex w-full items-center gap-2.5">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <div className="flex items-center gap-2.5">
                        {/*드롭다운 섹션 ( 동행,동행 소감, 받은 소감 )*/}
                        <h2 className="w-40 text-2xl font-bold">
                            {getCategoryDisplayText(categoryId)}
                        </h2>
                        <PopoverTrigger>
                            <Image
                                width={18}
                                height={18}
                                alt="dropdown icon"
                                src="/icon/profile/dropDown.svg"
                                className="cursor-pointer"
                            />
                        </PopoverTrigger>
                    </div>

                    <PopoverContent
                        className="mt-2 mr-5 w-40 gap-3 p-0"
                        align="end"
                        alignOffset={0}
                        sideOffset={5}
                    >
                        {otherCategories.map((category) => (
                            <p
                                key={category.id}
                                className="hover:text-sky-blue cursor-pointer text-center text-2xl font-bold transition-colors hover:bg-neutral-100"
                                onClick={() =>
                                    handleCategoryChange(
                                        category.id as CategoryId,
                                    )
                                }
                            >
                                {getCategoryDisplayText(
                                    category.id as CategoryId,
                                )}
                            </p>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            {/*탭 포함된 하단 섹션*/}
            <Tab
                tabItems={currentTabs.map((tab) => tab.label)}
                selectedTab={currentTab.label}
                onChange={handleTabChange}
                className="sticky top-18 z-20 mb-[50px] border-b border-b-[#AAAAAAA] leading-relaxed"
            />

            {/*탭 아래에 보이는 섹션*/}
            <section>{renderTabContent()}</section>
        </>
    );
}
