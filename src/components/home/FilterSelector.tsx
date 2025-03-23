'use client';

import { ScrollCalender } from '@/components/home/ScrollCalender';
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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

const groupThemeOptions = [
    '친구 동행',
    '부부 동행',
    '투어 동행',
    '숙박 공유',
    '전시/공연 동행',
    '맛집 동행',
];
const peopleOptions = ['2인', '10인 이하', '10인 이상'];
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

export default function FilterSelector() {
    const [location, setLocation] = useState<string>('');
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [groupTheme, setGroupTheme] = useState<string>('');
    const [people, setPeople] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // 모달 애니메이션, duration-300에 맞춰 셋타임아웃
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleSearch = () => {
        const filterData = {
            location,
            date,
            groupTheme,
            people,
            gender,
            age,
        };

        // 확인용 메세지
        alert(JSON.stringify(filterData));
    };

    // 데스크탑 필터
    const DesktopFilterOptions = () => (
        <div className="flex w-full flex-wrap justify-between">
            {/* 여행지 설정 */}
            <div className="inline-flex w-[239px] gap-9 rounded-lg border border-solid border-[#e9e9e9] px-7 py-4">
                <Image
                    src="/icon/home/pinIcon.svg"
                    alt="위치 아이콘"
                    width={17}
                    height={17}
                />
                <Input
                    className="h-auto w-auto border-0 p-0 tracking-[-0.02px] text-[#999999] shadow-none placeholder:text-[#999999] focus-visible:ring-0"
                    placeholder="여행지는 어디인가요?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {/* 날짜 범위 셀렉터 */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'h-auto w-[271px] gap-9 pr-[18px] pl-7',
                            !date && 'text-[#999999]',
                        )}
                    >
                        <Image
                            src="/icon/home/calenderIcon.svg"
                            alt="달력 아이콘"
                            width={17}
                            height={17}
                        />
                        {date?.from ? (
                            date.to ? (
                                <span className="mr-auto text-base font-normal">
                                    {format(date.from, 'MM.dd E', {
                                        locale: ko,
                                    })}{' '}
                                    -{' '}
                                    {format(date.to, 'MM.dd E', { locale: ko })}{' '}
                                    (
                                    {Math.ceil(
                                        (date.to.getTime() -
                                            date.from.getTime()) /
                                            (1000 * 60 * 60 * 24),
                                    )}
                                    박)
                                </span>
                            ) : (
                                <span className="mr-auto text-base font-normal">
                                    {format(date.from, 'MM.dd E', {
                                        locale: ko,
                                    })}
                                </span>
                            )
                        ) : (
                            <span className="mr-auto">날짜는 언제인가요?</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={ko}
                    />
                </PopoverContent>
            </Popover>

            {/* 동행 테마 */}
            <Select value={groupTheme} onValueChange={setGroupTheme}>
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
                            className="tracking-[-0.02px] text-[#999999]"
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

            {/* 동행 인원 */}
            <Select value={people} onValueChange={setPeople}>
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
                    {peopleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* 성별 & 나이 통합 */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className="h-auto w-[176px] gap-6 py-4 pr-[18px] pl-7"
                    >
                        <div className="flex gap-5">
                            <Image
                                src="/icon/home/smileIcon.svg"
                                alt="성별/나이 아이콘"
                                width={17}
                                height={17}
                            />
                            <span className="text-base font-normal text-[#999999]">
                                {gender || age
                                    ? `${gender} ${age}`.trim()
                                    : '성별/나이'}
                            </span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-5">
                    <div className="flex flex-col gap-6">
                        {/* 성별 */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-bold">성별</h3>
                            <div className="flex flex-wrap gap-2">
                                {genderOptions.map((option) => (
                                    <Button
                                        key={option}
                                        size="sm"
                                        className="h-8 px-3"
                                        variant={
                                            gender === option
                                                ? 'selected'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setGender(
                                                gender === option ? '' : option,
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
                                        className="h-8 px-3"
                                        variant={
                                            age === option
                                                ? 'selected'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setAge(age === option ? '' : option)
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

            {/* 데스크탑 뷰에서 검색 버튼 */}
            <Button
                variant="default"
                className="h-auto w-[92px] gap-9 px-8 py-4 text-base font-semibold"
                onClick={handleSearch}
            >
                검색
            </Button>
        </div>
    );

    // 모바일 필터
    const MobileFilterOptions = () => {
        return (
            <div className="flex w-full flex-col gap-6">
                {/* [모바일] 여행지 설정 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">동행지</h3>
                        <div className="inline-flex w-full gap-9 rounded-lg border border-solid border-[#e9e9e9] bg-white px-7 py-3">
                            <Image
                                src="/icon/home/pinIcon.svg"
                                alt="위치 아이콘"
                                width={17}
                                height={17}
                            />
                            <Input
                                className="h-auto border-0 p-0 tracking-[-0.02px] text-[#999999] shadow-none placeholder:text-[#999999] focus-visible:ring-0"
                                placeholder="여행지는 어디인가요?"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* [모바일] 날짜 범위 셀렉터 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">날짜 지정</h3>
                        <ScrollCalender />
                    </div>
                </div>

                {/* 동행 테마 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">동행 테마</h3>
                        <div className="flex flex-wrap gap-5">
                            {groupThemeOptions.map((option) => (
                                <Button
                                    key={option}
                                    className="min-w-[76px]"
                                    variant={
                                        groupTheme === option
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        setGroupTheme(
                                            groupTheme === option ? '' : option,
                                        )
                                    }
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 인원수 */}
                <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold">인원수</h3>
                        <div className="flex flex-wrap gap-5">
                            {peopleOptions.map((option) => (
                                <Button
                                    key={option}
                                    className="max-w-[79px] min-w-[52px]"
                                    variant={
                                        people === option
                                            ? 'selected'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        setPeople(
                                            people === option ? '' : option,
                                        )
                                    }
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

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
                                        setGender(
                                            gender === option ? '' : option,
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
                                        setAge(age === option ? '' : option)
                                    }
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 검색 버튼 */}
                <Button
                    variant="default"
                    className="mt-4 h-auto w-full gap-9 px-8 py-4 text-base font-semibold"
                    onClick={handleSearch}
                >
                    검색
                </Button>
            </div>
        );
    };

    return (
        <>
            {/* 기존 데스크탑 옵션 */}
            <div className="hidden w-full min-[1200px]:block">
                <DesktopFilterOptions />
            </div>

            {/* 모바일 모달 진입 버튼 */}
            <div className="block w-full min-[1200px]:hidden">
                <Image
                    src={'/icon/home/searchIcon.svg'}
                    alt="검색 아이콘"
                    width={16.5}
                    height={16.5}
                />
                <Button
                    variant="gray"
                    className="mt-20 w-full text-base font-semibold"
                    onClick={() => setIsOpen(true)}
                >
                    동행글 조건 입력하기
                </Button>

                {/* 모바일 모달 */}
                {isOpen && (
                    <div className="fixed inset-0 z-50" onClick={handleClose}>
                        <div
                            className={`fixed right-0 bottom-0 left-0 z-50 h-screen w-full overflow-y-auto bg-white p-6 transition-all duration-300 ${
                                isClosing
                                    ? 'translate-y-full'
                                    : 'animate-in slide-in-from-bottom translate-y-0'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <header className="mb-6 flex h-[60px] w-full items-center">
                                <button
                                    className="flex h-6 w-6 items-center justify-center"
                                    onClick={handleClose}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                                <div className="flex-1 text-center text-2xl font-semibold">
                                    동행글 찾기
                                </div>
                                <div className="h-6 w-6"></div>
                            </header>
                            <MobileFilterOptions />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
