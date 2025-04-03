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
import { setGroupSize } from '@/redux/slices/filterSlice';
import Image from 'next/image';

const groupSizeOptions = ['2인', '10인 이하', '10인 이상'];

export const GroupSizeFilter = () => {
    const groupSize = useAppSelector((state) => state.filter.groupSize);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 1200px)');

    if (isMobile) {
        return (
            <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold">인원수</h3>
                    <div className="flex flex-wrap gap-5">
                        {groupSizeOptions.map((option) => (
                            <Button
                                key={option}
                                className="max-w-[79px] min-w-[52px]"
                                variant={
                                    groupSize === option
                                        ? 'selected'
                                        : 'outline'
                                }
                                onClick={() =>
                                    dispatch(
                                        setGroupSize(
                                            groupSize === option ? '' : option,
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
            value={groupSize}
            onValueChange={(value) => dispatch(setGroupSize(value))}
        >
            <SelectTrigger className="h-auto w-[176px] gap-6 py-4 pr-[18px] pl-7">
                <div className="flex gap-5">
                    <Image
                        src="/icon/home/groupIcon.svg"
                        alt="그룹 아이콘"
                        width={17}
                        height={17}
                    />
                    <SelectValue
                        placeholder="인원 수"
                        className="text-base font-normal tracking-[-0.02px] text-[#999999]"
                    />
                </div>
            </SelectTrigger>
            <SelectContent>
                {groupSizeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
