'use client';

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
import { useState } from 'react';

export default function PostSetupPanel() {
    const [title, setTitle] = useState<string>('');

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
        undefined,
    );
    const [deadlineTime, setDeadlineTime] = useState<string>('');

    const [groupTheme, setGroupTheme] = useState<string>('');
    const [groupSize, setGroupSize] = useState<string>('');

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

    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedAges, setSelectedAges] = useState<string[]>([]);

    const handleGenderToggle = (id: string) => {
        setSelectedGender(selectedGender === id ? null : id);
    };

    const handleAgeToggle = (id: string) => {
        if (id === 'notCare') {
            setSelectedAges(
                selectedAges.includes('notCare') ? [] : ['notCare'],
            );
        } else {
            setSelectedAges((prev) => {
                const ageGroupsWithoutNotCare = ageGroups
                    .filter((age) => age.id !== 'notCare')
                    .map((age) => age.id);

                const newSelection = prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev.filter((item) => item !== 'notCare'), id];

                if (newSelection.length === ageGroupsWithoutNotCare.length) {
                    return ['notCare'];
                }

                return newSelection;
            });
        }
    };

    const handleSubmit = () => {
        // "yyyy. MM. dd." 형식으로 날짜 출력
        const formatDateString = (date: Date | undefined) => {
            if (!date) return '';
            return format(date, 'yyyy. MM. dd.', { locale: ko });
        };

        const formData = {
            title,
            date: {
                from: formatDateString(startDate),
                to: formatDateString(endDate),
            },
            recruitmentDeadline: {
                date: formatDateString(deadlineDate),
                time: deadlineTime,
            },
            groupTheme,
            groupSize,
            gender: selectedGender,
            age: selectedAges,
        };

        alert(JSON.stringify(formData));
    };

    return (
        <div className="flex w-full flex-col items-start gap-8">
            <section className="flex w-full flex-col items-start gap-2.5">
                <h1 className="mt-10 mb-[70px] text-2xl font-bold">
                    동행 작성하기
                </h1>
                <h2 className="text-base leading-6 font-bold text-black">
                    제목
                </h2>
                <div className="w-full rounded-lg border border-[#e9e9e9] p-4">
                    <input
                        type="text"
                        placeholder="제목을 입력 해주세요."
                        className="w-full text-xl font-bold outline-none placeholder:font-normal placeholder:text-[#999999]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            </section>

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
                                    onSelect={setStartDate}
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
                                    onSelect={setEndDate}
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
                                    onSelect={setDeadlineDate}
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
                                        setDeadlineTime(e.target.value)
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
                    <Select value={groupTheme} onValueChange={setGroupTheme}>
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
                    <Select value={groupSize} onValueChange={setGroupSize}>
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

            {/* 확인용 임시 버튼 */}
            <Button className="mb-9 ml-auto" onClick={handleSubmit}>
                저장된 데이터 확인
            </Button>
        </div>
    );
}
