'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useLocale } from '@/hooks/useLocale';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setGroupTheme } from '@/redux/slices/filterSlice';
import Image from 'next/image';

const groupThemeOptions = [
    { value: '전시/공연 동행', label: '전시/공연 동행' },
    { value: '맛집 동행', label: '맛집 동행' },
    { value: '투어 동행', label: '투어 동행' },
    { value: '숙박 공유', label: '숙박 공유' },
    { value: '부분 동행', label: '부분 동행' },
    { value: '가족 동행', label: '가족 동행' },
];

export const GroupThemeFilter = () => {
    const groupTheme = useAppSelector((state) => state.filter.groupTheme);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 1200px)');
    const { t } = useLocale();

    if (isMobile) {
        return (
            <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold">{t.filter.theme}</h3>
                    <div className="flex flex-wrap gap-5">
                        {groupThemeOptions.map((option, keyId) => (
                            <Button
                                key={keyId}
                                value={option.value}
                                className="w-fit min-w-[76px]"
                                variant={
                                    groupTheme === option.value
                                        ? 'selected'
                                        : 'outline'
                                }
                                onClick={() =>
                                    dispatch(
                                        setGroupTheme(
                                            groupTheme === option.value
                                                ? ''
                                                : option.value,
                                        ),
                                    )
                                }
                            >
                                {option.label}
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
            <SelectTrigger className="h-auto w-[176px] gap-9 overflow-hidden py-4 pr-[18px] pl-7">
                <div className="flex gap-5">
                    <Image
                        src="/icon/home/openedBookIcon.svg"
                        alt="책 아이콘"
                        width={17}
                        height={17}
                    />
                    <SelectValue
                        placeholder={t.filter.theme}
                        className={
                            groupTheme
                                ? 'text-base font-medium tracking-[-0.02px] text-black'
                                : 'tracking-[-0.02px] text-[#999999]'
                        }
                    />
                </div>
            </SelectTrigger>
            <SelectContent>
                {groupThemeOptions.map((option, keyId) => (
                    <SelectItem key={keyId} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
