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
            className="h-12 w-full py-[14.5px] text-base font-semibold"
            onClick={() => dispatch(openModal())}
        >
            <Image
                src={'/icon/home/searchIcon.svg'}
                alt="검색 아이콘"
                width={16.5}
                height={16.5}
            />
            <p>동행글 조건 입력하기</p>
        </Button>
    );
};
