'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/filterSlice';
import Image from 'next/image';

export const MobileFilterButton = () => {
    const dispatch = useAppDispatch();

    return (
        <Button
            variant="gray"
            className="w-full text-base font-semibold"
            onClick={() => dispatch(openModal())}
        >
            <Image
                src={'/icon/home/searchIcon.svg'}
                alt="검색 아이콘"
                width={16.5}
                height={16.5}
            />
            동행글 조건 입력하기
        </Button>
    );
};
