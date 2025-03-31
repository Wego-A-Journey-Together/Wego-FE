'use client';

import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import KakaoKeywordSearch from '@/components/write/KakaoKeywordSearch';
import { useState } from 'react';

export type SelectedPlace = {
    placeName: string;
    lat: number;
    lng: number;
};

type Props = {
    field: {
        value: SelectedPlace;
        onChange: (value: SelectedPlace) => void;
    };
};

export default function LocationSelector({ field }: Props) {
    const [keyword, setKeyword] = useState<string>('');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [locationSelected, setLocationSelected] = useState(false);

    // 입력값이 변경될 때마다 검색 키워드 업데이트
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        setSearchKeyword(value);

        // 키워드가 변경되면 장소 선택 상태 초기화
        if (locationSelected) {
            setLocationSelected(false);
        }
    };

    // 엔터키 또는 검색 버튼 클릭 처리
    const handleSearch = () => {
        setSearchKeyword(keyword);
    };

    // 장소 선택 처리
    const handleSelectPlace = (place: {
        placeName: string;
        lat: number;
        lng: number;
    }) => {
        field.onChange(place);
        setLocationSelected(true);
    };

    return (
        <div className="mt-2.5 w-full">
            <FormLabel htmlFor={'location'}>
                <h2 className={'text-base font-bold'}>장소</h2>
            </FormLabel>
            <div
                className="mt-2.5 flex items-center gap-2.5"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                    }
                }}
            >
                <Input
                    placeholder="여행지를 입력해 주세요"
                    value={keyword ?? ''}
                    onChange={handleKeywordChange}
                    className="h-11 w-full rounded-lg p-4 text-base text-[#666666]"
                    id="location"
                />
                <Button
                    type="button"
                    variant="outline"
                    className="border-sky-blue text-sky-blue h-11 border-2 px-7.5 py-2 text-sm font-semibold"
                    onClick={handleSearch}
                >
                    위치 찾기
                </Button>
            </div>

            {/* 검색 결과 또는 선택된 장소가 있을 때만 컨테이너 표시 */}
            {(searchKeyword || locationSelected) && (
                <div className="relative mt-4 rounded border bg-white p-4 shadow">
                    <KakaoKeywordSearch
                        keyword={searchKeyword}
                        onSelectPlace={handleSelectPlace}
                        onFixKeyword={(placeName) => {
                            setKeyword(placeName);
                            setSearchKeyword('');
                        }}
                    />
                </div>
            )}
        </div>
    );
}
