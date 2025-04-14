'use client';

import { useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';

import { DesktopFilterOptions } from './filter/DesktopFilterOptions';
import { MobileFilterButton } from './filter/MobileFilterButton';
import { MobileFilterModal } from './filter/MobileFilterModal';

export default function FilterSelector() {
    const router = useRouter();
    const pathname = usePathname();
    const location = useAppSelector((state) => state.filter.location);
    const startDate = useAppSelector((state) => state.filter.startDate);
    const endDate = useAppSelector((state) => state.filter.endDate);
    const groupTheme = useAppSelector((state) => state.filter.groupTheme);
    const groupSize = useAppSelector((state) => state.filter.groupSize);
    const gender = useAppSelector((state) => state.filter.gender);
    const age = useAppSelector((state) => state.filter.age);
    const isGroupOpen = useAppSelector((state) => state.filter.isGroupOpen);

    const handleSearch = () => {
        const filterParams = new URLSearchParams();

        // 카테고리를 선택한 경우에만 파라미터 추가
        if (groupTheme && groupTheme.trim() !== '') {
            const categoryMap: { [key: string]: string } = {
                '전시/공연 동행': 'SHOW',
                '맛집 동행': 'RESTAURANT',
                '투어 동행': 'TOUR',
                '숙박 공유': 'SHARE',
                '부분 동행': 'PART',
                '가족 동행': 'FAMILY',
            };

            // 매핑된 값이 있는 경우에만 파라미터 추가
            const mappedCategory = categoryMap[groupTheme];
            if (mappedCategory) {
                filterParams.set('category', mappedCategory);
            }
        }

        // 성별 매핑
        if (gender) {
            const genderMap: { [key: string]: string } = {
                여성: 'FEMALE',
                남성: 'MALE',
                무관: 'ANY',
            };
            filterParams.set('preferredGender', genderMap[gender] || 'ANY');
        }

        // 나이 매핑
        if (age) {
            const ageMap: { [key: string]: string } = {
                '10대': 'TEENS',
                '20대': 'TWENTIES',
                '30대': 'THIRTIES',
                '40대': 'FORTIES',
                '50대': 'FIFTIES',
                '60대': 'SIXTIES',
                '70대': 'SEVENTIES',
            };
            filterParams.set('preferredAge', ageMap[age] || 'TWENTIES');
        }

        // 모집 중인 그룹만 보기 옵션이 활성화된 경우
        if (isGroupOpen) {
            // 백엔드에서 제공하는 정확한 파라미터 사용
            const now = new Date().toISOString();
            filterParams.set('closedAtAfter', now);
        }

        // 기본 필터 파라미터 설정
        if (location) filterParams.set('address', location);
        if (startDate) filterParams.set('startDate', startDate);
        if (endDate) filterParams.set('endDate', endDate);
        if (groupSize) {
            const sizeNumber = parseInt(groupSize.replace(/[^0-9]/g, ''));
            filterParams.set('maxParticipants', String(sizeNumber || 20));
        }

        // 페이지네이션 파라미터 추가
        filterParams.set('page', '0');
        filterParams.set('size', '10');

        // URL 업데이트 (현재 경로 유지하고 쿼리 파라미터만 변경)
        const segments = pathname.split('/').filter(Boolean);
        const locale = segments[0] ?? 'ko';
        const queryString = filterParams.toString();

        // 현재 경로를 유지하고 쿼리 파라미터만 변경
        const url = `/${locale}?${queryString}`;
        router.push(url);
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
