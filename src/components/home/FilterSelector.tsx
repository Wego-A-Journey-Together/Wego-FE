'use client';

import { useAppSelector } from '@/redux/hooks';

import { DesktopFilterOptions } from './filter/DesktopFilterOptions';
import { MobileFilterButton } from './filter/MobileFilterButton';
import { MobileFilterModal } from './filter/MobileFilterModal';

export default function FilterSelector() {
    const location = useAppSelector((state) => state.filter.location);
    const date = useAppSelector((state) => state.filter.date);
    const groupTheme = useAppSelector((state) => state.filter.groupTheme);
    const groupSize = useAppSelector((state) => state.filter.groupSize);
    const gender = useAppSelector((state) => state.filter.gender);
    const age = useAppSelector((state) => state.filter.age);

    const handleSearch = () => {
        const filterData = {
            location,
            date,
            groupTheme,
            groupSize,
            gender,
            age,
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
