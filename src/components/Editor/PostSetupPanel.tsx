'use client';

import { PostFormValues } from '@/app/[lang]/write/postSchema';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

export default function PostSetupPanel() {
    const { setValue, watch } = useFormContext<PostFormValues>();
    const startDate = watch('filter.startDate') ?? undefined;
    const endDate = watch('filter.endDate') ?? undefined;
    const deadlineDate = watch('filter.deadlineDate') ?? undefined;
    const deadlineTime = watch('filter.deadlineTime') ?? '';
    const groupTheme = watch('filter.groupTheme') ?? '';
    const groupSize = watch('filter.groupSize') ?? '';
    const selectedGender = watch('filter.gender') ?? null;
    const selectedAges = watch('filter.age') ?? [];

    const ageGroups = [
        { id: 'notCare', label: '무관' },
        { id: '10s', label: '10대' },
        { id: '20s', label: '20대' },
        { id: '30s', label: '30대' },
        { id: '40s', label: '40대' },
        { id: '50s', label: '50대' },
        { id: '60s', label: '60대' },
        { id: '70s', label: '70대' },
    ];

    const genderOptions = [
        { id: 'notCare', label: '무관' },
        { id: 'female', label: '여성' },
        { id: 'male', label: '남성' },
    ];

    const handleGenderToggle = (id: string) => {
        const newValue = selectedGender === id ? '' : id;
        setValue('filter.gender', newValue);
    };

    const handleAgeToggle = (id: string) => {
        if (id === 'notCare') {
            const newValue = selectedAges.includes('notCare')
                ? []
                : ['notCare'];
            setValue('filter.age', newValue);
        } else {
            const ageGroupsWithoutNotCare = ageGroups
                .filter((age) => age.id !== 'notCare')
                .map((age) => age.id);

            const newSelection = selectedAges.includes(id)
                ? selectedAges.filter((item) => item !== id)
                : [...selectedAges.filter((item) => item !== 'notCare'), id];

            if (newSelection.length === ageGroupsWithoutNotCare.length) {
                setValue('filter.age', ['notCare']);
            } else {
                setValue('filter.age', newSelection);
            }
        }
    };

    return (
        <div className="mt-6 flex w-full flex-col items-start gap-8">
            <section className="flex w-full flex-wrap items-start gap-6">
                <div className="flex flex-col items-start gap-2.5">
                    <h2 className="text-base leading-6 font-bold text-black">
                        동행 일정
                    </h2>
                    <div className="flex items-center gap-1.5">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex w-[150px] cursor-pointer items-center gap-2.5 rounded-lg border border-solid border-[#e9e9e9] px-4 py-2.5">
                                    <Image
                                        width={17}
                                        height={18}
                                        alt="calender image"
                                        src={'/icon/home/calenderIcon.svg'}
                                    />
                                    <span className="text-base font-medium text-black">
                                        {startDate ? (
                                            format(startDate, 'MM.dd EEE', {
                                                locale: ko,
                                            })
                                        ) : (
                                            <span className="font-normal text-[#999999]">
                                                날짜추가
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="p-2" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) =>
                                        date &&
                                        setValue('filter.startDate', date)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <span className="text-base font-medium text-[#999999]">
                            -
                        </span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex w-[150px] cursor-pointer items-center gap-2.5 rounded-lg border border-solid border-[#e9e9e9] px-4 py-2.5">
                                    <Image
                                        width={17}
                                        height={18}
                                        alt="calender image"
                                        src={'/icon/home/calenderIcon.svg'}
                                    />
                                    <span className="text-base font-medium text-black">
                                        {endDate ? (
                                            format(endDate, 'MM.dd EEE', {
                                                locale: ko,
                                            })
                                        ) : (
                                            <span className="font-normal text-[#999999]">
                                                날짜추가
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="p-2" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) =>
                                        date && setValue('filter.endDate', date)
                                    }
                                    initialFocus
                                    disabled={(date) =>
                                        startDate ? date < startDate : false
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-2.5">
                    <h2 className="text-base leading-6 font-bold text-black">
                        동행원 모집 마감일
                    </h2>
                    <div className="flex items-center gap-1.5">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex w-[150px] cursor-pointer items-center gap-2.5 rounded-lg border border-solid border-[#e9e9e9] px-4 py-2.5">
                                    <Image
                                        width={17}
                                        height={18}
                                        alt="calender image"
                                        src={'/icon/home/calenderIcon.svg'}
                                    />
                                    <span className="text-base font-medium text-black">
                                        {deadlineDate ? (
                                            format(deadlineDate, 'MM.dd EEE', {
                                                locale: ko,
                                            })
                                        ) : (
                                            <span className="font-normal text-[#999999]">
                                                날짜추가
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="p-2" align="start">
                                <Calendar
                                    mode="single"
                                    selected={deadlineDate}
                                    onSelect={(date) =>
                                        date &&
                                        setValue('filter.deadlineDate', date)
                                    }
                                    initialFocus
                                    disabled={(date) =>
                                        endDate ? date < endDate : false
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex h-11 w-[120px] cursor-pointer items-center rounded-lg border border-solid border-[#e9e9e9] px-4 py-2.5">
                                    <span className="text-base font-medium text-black">
                                        {deadlineTime || (
                                            <span className="font-normal text-[#999999]">
                                                시간 선택
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-2"
                                align="start"
                            >
                                <Input
                                    type="time"
                                    id="time"
                                    value={deadlineTime}
                                    onChange={(e) =>
                                        setValue(
                                            'filter.deadlineTime',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-2.5">
                    <h2 className="text-base leading-6 font-bold text-black">
                        동행 테마
                    </h2>
                    <Select
                        value={groupTheme}
                        onValueChange={(value) =>
                            setValue('filter.groupTheme', value)
                        }
                    >
                        <SelectTrigger className="h-11 w-[280px] rounded-lg border border-solid border-[#e9e9e9] px-4 py-2.5">
                            <SelectValue placeholder="동행 테마 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="friends">친구 동반</SelectItem>
                            <SelectItem value="couple">부부 동반</SelectItem>
                            <SelectItem value="tour">투어 동반</SelectItem>
                            <SelectItem value="booking">숙박 공유</SelectItem>
                            <SelectItem value="event">
                                전시/공연 동행
                            </SelectItem>
                            <SelectItem value="food">맛집 동행</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className="flex w-full flex-wrap items-start gap-6">
                <div className="flex flex-col items-start gap-2.5">
                    <h2 className="text-base leading-6 font-bold text-black">
                        동행 인원
                    </h2>
                    <Select
                        value={groupSize}
                        onValueChange={(value) =>
                            setValue('filter.groupSize', value)
                        }
                    >
                        <SelectTrigger className="h-11 w-[280px] rounded-lg border border-solid border-[#e9e9e9] px-4 py-2.5">
                            <SelectValue placeholder="동행 인원 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="under10">2인</SelectItem>
                            <SelectItem value="under20">10인 이하</SelectItem>
                            <SelectItem value="under30">10인 이상</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col items-start gap-2.5">
                    <h2 className="text-base leading-6 font-bold text-black">
                        선호 성별
                    </h2>
                    <div className="flex gap-2.5">
                        {genderOptions.map((option) => (
                            <Button
                                key={option.id}
                                className="h-[44px]"
                                variant={
                                    selectedGender === option.id
                                        ? 'selected'
                                        : 'outline'
                                }
                                onClick={() => handleGenderToggle(option.id)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-start gap-2.5">
                    <h2 className="text-base leading-6 font-bold text-black">
                        선호 연령대
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                        {ageGroups.map((age) => (
                            <Button
                                key={age.id}
                                className="h-[44px]"
                                variant={
                                    selectedAges.includes(age.id)
                                        ? 'selected'
                                        : 'outline'
                                }
                                onClick={() => handleAgeToggle(age.id)}
                            >
                                {age.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
