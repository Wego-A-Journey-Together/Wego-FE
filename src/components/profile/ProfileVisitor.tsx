'use client';

import Tab from '@/components/common/Tab';
import ReceivedReview from '@/components/profile/ReceivedReview';
import { useState } from 'react';

const SOGAM_TABS = [{ id: 'received', label: '받은 소감' }];

export default function ProfileVisitor() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (index: number) => {
        setTabIndex(index);
    };

    return (
        <>
            <div className="mb-10 flex w-full items-center gap-2.5">
                <h2 className="w-40 text-2xl font-bold">동행 소감</h2>
            </div>

            <Tab
                tabItems={SOGAM_TABS.map((tab) => tab.label)}
                selectedTab={SOGAM_TABS[tabIndex].label}
                onChange={handleTabChange}
                className="sticky top-18 z-20 mb-[50px] border-b border-b-[#AAAAAAA] leading-relaxed"
            />

            <section>
                <ReceivedReview />
            </section>
        </>
    );
}
