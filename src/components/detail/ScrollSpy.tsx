'use client';

import Tab from '@/components/common/Tab';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const tabItems = [
    '상세 정보',
    '동행지 위치',
    '멤버 소개',
    '댓글',
    '소감',
] as const;

type TabItem = (typeof tabItems)[number];

export default function ScrollSpy({
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
        <Tab
            tabItems={tabItems} // 탭 목록
            selectedTab={selectedTab} // 현재 선택된 탭
            onChange={handleChangeTab} // 탭 클릭 시 실행되는 콜백
        />
    );
}
