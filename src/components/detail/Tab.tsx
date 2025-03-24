'use client';

import { cn } from '@/lib';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const tabItems = [
    '상세 정보',
    '동행지 위치',
    '멤버 소개',
    '댓글',
    '리뷰',
] as const;

type TabItem = (typeof tabItems)[number];

export default function Tab({
    refs,
}: {
    refs: React.RefObject<HTMLDivElement | null>[];
}) {
    const [selectedTab, setSelectedTab] = useState<TabItem>(tabItems[0]);

    // 탭을 눌러 스크롤시에 Observer 함께 동작하여 UI 불안정한 문제 해결을 위한 플래그
    const isScrollByTabClick = useRef<boolean>(false);

    // IntersectionObserver 콜백함수
    const handleIntersection = useCallback<IntersectionObserverCallback>(
        (entries) => {
            /**
             * 탭 클릭으로 인한 scrollIntoView 함수 실행중엔 얼리리턴해서 무시함
             */
            if (isScrollByTabClick.current) return;

            /**
             * 각 entry가 감지되었을 때,
             * 해당 entry.target과 일치하는 ref를 찾아 탭 인덱스를 계산하고,
             * 현재 탭 상태를 업데이트한다.
             */
            entries.forEach((entry) => {
                // 요소가 잡히면 찾아서
                if (entry.isIntersecting) {
                    const tabIndex = refs.findIndex(
                        (ref) => ref.current === entry.target,
                    );
                    // 업데이트
                    setSelectedTab(tabItems[tabIndex]);
                }
            });
        },
        [refs],
    );
    /**
     * ScrollSpy 기능 구현체
     */
    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: null, // 뷰포트기준
            threshold: 0.7,
        });
        refs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [handleIntersection, refs]);

    const handleChangeTab = (idx: number) => {
        setSelectedTab(tabItems[idx]);
        refs[idx].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        isScrollByTabClick.current = true;

        // 잠시 후 Ref 값을 false 로 변경
        setTimeout(() => {
            isScrollByTabClick.current = false;
        }, 500);
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
                            `cursor-pointer border-b-2 border-transparent transition-all duration-300 select-none`,
                            selectedTab === tab &&
                                `border-sky-blue text-sky-blue cursor-default`,
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
