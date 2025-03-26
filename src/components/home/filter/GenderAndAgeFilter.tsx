'use client';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAge, setGender } from '@/redux/slices/filterSlice';
import { ChevronDownIcon } from 'lucide-react';
import Image from 'next/image';

const genderOptions = ['무관', '여성', '남성'];

const ageOptions = [
    '무관',
    '10대',
    '20대',
    '30대',
    '40대',
    '50대',
    '60대',
    '70대',
];

export const GenderAndAgeFilter = () => {
    const gender = useAppSelector((state) => state.filter.gender);
    const age = useAppSelector((state) => state.filter.age);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 1200px)');

    if (isMobile) {
        return (
            <>
                {/* 성별 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">성별</h3>
                        <div className="flex flex-wrap gap-5">
                            {genderOptions.map((option) => (
                                <Button
                                    key={option}
                                    className="w-[52px]"
                                    variant={
                                        gender === option
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setGender(
                                                gender === option ? '' : option,
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

                {/* 나이 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">나이</h3>
                        <div className="flex flex-wrap gap-5">
                            {ageOptions.map((option) => (
                                <Button
                                    key={option}
                                    className="max-w-[52px] min-w-[52px]"
                                    variant={
                                        age === option ? 'selected' : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setAge(
                                                age === option ? '' : option,
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
            </>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className="h-auto w-[176px] justify-between gap-6 py-4 pr-[18px]"
                >
                    <div className="flex items-center gap-5 pl-3">
                        <Image
                            src="/icon/home/smileIcon.svg"
                            alt="성별/나이 아이콘"
                            width={17}
                            height={17}
                        />
                        <span
                            className={`text-base font-normal ${gender || age ? 'text-foreground' : 'text-[#999999]'}`}
                        >
                            {gender || age
                                ? `${gender} ${age}`.trim()
                                : '성별/나이'}
                        </span>
                    </div>
                    <ChevronDownIcon className="mr-1.5 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[306px] px-7 py-6">
                <div className="flex flex-col gap-6">
                    {/* 성별 */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold">성별</h3>
                        <div className="flex flex-wrap gap-2">
                            {genderOptions.map((option) => (
                                <Button
                                    key={option}
                                    className="h-8 w-[52px] px-3"
                                    variant={
                                        gender === option
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setGender(
                                                gender === option ? '' : option,
                                            ),
                                        )
                                    }
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* 나이 */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold">나이</h3>
                        <div className="flex flex-wrap gap-2">
                            {ageOptions.map((option) => (
                                <Button
                                    key={option}
                                    size="sm"
                                    className="h-8 w-[52px] px-3"
                                    variant={
                                        age === option ? 'selected' : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setAge(
                                                age === option ? '' : option,
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
            </PopoverContent>
        </Popover>
    );
};
