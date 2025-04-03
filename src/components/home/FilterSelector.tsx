'use client';

import { useAppSelector } from '@/redux/hooks';

import { DesktopFilterOptions } from './filter/DesktopFilterOptions';
import { MobileFilterButton } from './filter/MobileFilterButton';
import { MobileFilterModal } from './filter/MobileFilterModal';

export default function FilterSelector() {
    const location = useAppSelector((state) => state.filter.location);
    const startDate = useAppSelector((state) => state.filter.startDate);
    const endDate = useAppSelector((state) => state.filter.endDate);
    const groupTheme = useAppSelector((state) => state.filter.groupTheme);
    const groupSize = useAppSelector((state) => state.filter.groupSize);
    const gender = useAppSelector((state) => state.filter.gender);
    const age = useAppSelector((state) => state.filter.age);
    const isGroupOpen = useAppSelector((state) => state.filter.isGroupOpen);

    const handleSearch = () => {
        const filterData = {
            location,
            startDate,
            endDate,
            groupTheme,
            groupSize,
            gender,
            age,
            isGroupOpen,
        };

        // 확인용 메세지
        alert(JSON.stringify(filterData));
    };

    return (
        <>
            {/* 데스크탑 필터 옵션 */}
            <div className="hidden w-full min-[1200px]:block">
                <DesktopFilterOptions onSearch={handleSearch} />
            </div>

            {/* 모바일 필터 버튼 및 모달 */}
            <div className="block w-full min-[1200px]:hidden">
                <MobileFilterButton />
                <MobileFilterModal onSearch={handleSearch} />
            </div>
        </>
    );
}
