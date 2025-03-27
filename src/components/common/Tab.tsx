'use client';

import { cn } from '@/lib';

interface TabProps {
    tabItems: readonly string[];

    selectedTab: string; // 혹은 (typeof tabItems)[number]

    /**
     * 탭 클릭 시 인덱스를 알리는 콜백
     */
    onChange: (index: number) => void;
}

export default function Tab({ tabItems, selectedTab, onChange }: TabProps) {
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
                        onClick={() => onChange(idx)}
                    >
                        {tab}
                    </div>
                );
            })}
        </div>
    );
}
