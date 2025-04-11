'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useLocale } from '@/hooks/useLocale';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setIsGroupOpen } from '@/redux/slices/filterSlice';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export const LikedPageFilter = () => {
    const dispatch = useAppDispatch();
    const isGroupOpen = useAppSelector((state) => state.filter.isGroupOpen);
    const { t } = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckboxChange = async (checked: boolean) => {
        dispatch(setIsGroupOpen(checked));
        setIsLoading(true);
        
        try {
            const filterParams = {
                isGroupOpen: checked
            };

            // 객체를 JSON 문자열로 변환 후 URL 인코딩
            const queryString = encodeURIComponent(JSON.stringify(filterParams));
            
            // 현재 경로에 쿼리 파라미터 추가
            router.push(`${pathname}?filters=${queryString}`);
        } catch (error) {
            console.error('필터 적용 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center mb-4">
            <Checkbox
                id="likedPageFilter"
                className="mr-1.5"
                checked={isGroupOpen}
                onCheckedChange={handleCheckboxChange}
                disabled={isLoading}
            />
            <label
                htmlFor="likedPageFilter"
                className="cursor-pointer"
                onClick={() => !isLoading && handleCheckboxChange(!isGroupOpen)}
            >
                {t.lookfor}
            </label>
        </div>
    );
};