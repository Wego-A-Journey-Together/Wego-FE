'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setGroupTheme } from '@/redux/slices/filterSlice';
import Image from 'next/image';

const groupThemeOptions = [
    '친구 동행',
    '부부 동행',
    '투어 동행',
    '숙박 공유',
    '전시/공연 동행',
    '맛집 동행',
];

export const GroupThemeFilter = () => {
    const groupTheme = useAppSelector((state) => state.filter.groupTheme);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 1200px)');

    if (isMobile) {
        return (
            <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold">동행 테마</h3>
                    <div className="flex flex-wrap gap-5">
                        {groupThemeOptions.map((option) => (
                            <Button
                                key={option}
                                className="w-fit min-w-[76px]"
                                variant={
                                    groupTheme === option
                                        ? 'selected'
                                        : 'outline'
                                }
                                onClick={() =>
                                    dispatch(
                                        setGroupTheme(
                                            groupTheme === option ? '' : option,
                                        ),
                                    )
                                }
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Select
            value={groupTheme}
            onValueChange={(value) => dispatch(setGroupTheme(value))}
        >
            <SelectTrigger className="h-auto w-[176px] gap-9 py-4 pr-[18px] pl-7">
                <div className="flex gap-5">
                    <Image
                        src="/icon/home/openedBookIcon.svg"
                        alt="책 아이콘"
                        width={17}
                        height={17}
                    />
                    <SelectValue
                        placeholder="동행 테마"
                        className={
                            groupTheme
                                ? 'text-base font-medium tracking-[-0.02px] text-black'
                                : 'tracking-[-0.02px] text-[#999999]'
                        }
                    />
                </div>
            </SelectTrigger>
            <SelectContent>
                {groupThemeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
