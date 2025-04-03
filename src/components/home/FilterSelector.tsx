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
        const filterParams = {
            location,
            startDate,
            endDate,
            groupTheme,
            groupSize,
            gender,
            age,
            isGroupOpen,
        };

        // 객체를 JSON 문자열로 변환 후 URL 인코딩
        const queryString = encodeURIComponent(JSON.stringify(filterParams));

        // API 엔드포인트 URL
        const apiUrl = `${process.env.NEST_BFF_URL}?filters=${queryString}`;

        // 완성시 삭제
        alert(apiUrl);

        fetch(apiUrl, { method: 'GET' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('서버 응답에 문제가 있습니다');
                }
                return response.json();
            })
            .then((data) => {
                console.log('서버 응답 데이터:', data);
            })
            .catch((error) => {
                console.error('검색 요청 오류:', error);
                alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
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
