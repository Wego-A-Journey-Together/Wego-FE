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

const GENDER_OPTIONS = [
    { id: 'notCare', label: '무관' },
    { id: 'female', label: '여성' },
    { id: 'male', label: '남성' },
];

const AGE_OPTIONS = [
    { id: 'notCare', label: '무관' },
    { id: '10s', label: '10대' },
    { id: '20s', label: '20대' },
    { id: '30s', label: '30대' },
    { id: '40s', label: '40대' },
    { id: '50s', label: '50대' },
    { id: '60s', label: '60대' },
    { id: '70s', label: '70대' },
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
                            {GENDER_OPTIONS.map((option, keyId) => (
                                <Button
                                    key={keyId}
                                    id={option.id}
                                    className="w-[52px]"
                                    variant={
                                        gender === option.label
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setGender(
                                                gender === option.label
                                                    ? ''
                                                    : option.label,
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

                {/* 나이 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">나이</h3>
                        <div className="flex flex-wrap gap-5">
                            {AGE_OPTIONS.map((option, keyId) => (
                                <Button
                                    key={keyId}
                                    id={option.id}
                                    className="max-w-[52px] min-w-[52px]"
                                    variant={
                                        age === option.label
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setAge(
                                                age === option.label
                                                    ? ''
                                                    : option.label,
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
                            {GENDER_OPTIONS.map((option, keyId) => (
                                <Button
                                    key={keyId}
                                    id={option.id}
                                    className="h-8 w-[52px] px-3"
                                    variant={
                                        gender === option.label
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setGender(
                                                gender === option.label
                                                    ? ''
                                                    : option.label,
                                            ),
                                        )
                                    }
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* 나이 */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold">나이</h3>
                        <div className="flex flex-wrap gap-2">
                            {AGE_OPTIONS.map((option, keyId) => (
                                <Button
                                    key={keyId}
                                    id={option.id}
                                    size="sm"
                                    className="h-8 w-[52px] px-3"
                                    variant={
                                        age === option.label
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        dispatch(
                                            setAge(
                                                age === option.label
                                                    ? ''
                                                    : option.label,
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
            </PopoverContent>
        </Popover>
    );
};
