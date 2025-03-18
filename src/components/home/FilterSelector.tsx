'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function FilterSelector() {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    return (
        <div className="flex w-full gap-2">
            {/* 여행지 설정 */}
            <div className="inline-flex gap-9 px-7 py-4 rounded-lg border border-solid border-[#e9e9e9]">
                <img
                    src="/icon/home/pinIcon.svg"
                    alt="위치 아이콘"
                    className="w-[17px]"
                />
                <Input
                    className="border-0 p-0 h-auto text-[#999999] tracking-[-0.02px] placeholder:text-[#999999] focus-visible:ring-0 shadow-none"
                    placeholder="여행지는 어디인가요?"
                />
            </div>

            {/* 날짜 범위 셀렉터 */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'gap-9 pl-7 pr-[18px] h-auto min-w-[273px]',
                            !date && 'text-[#999999]',
                        )}
                    >
                        <img
                            src="/icon/home/calenderIcon.svg"
                            alt="달력 아이콘"
                            className="w-[17px]"
                        />
                        {date?.from ? (
                            date.to ? (
                                <span className="font-normal text-base mr-auto">
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
                                <span className="font-normal text-base mr-auto">
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
            <Select>
                <SelectTrigger className="gap-9 pl-7 pr-[18px] py-4  h-auto">
                    <div className="flex gap-5">
                        <img
                            src="/icon/home/openedBookIcon.svg"
                            alt="책 아이콘"
                            className="w-[17px]"
                        />
                        <SelectValue
                            placeholder="동행 테마"
                            className="text-[#999999] tracking-[-0.02px]"
                        />
                    </div>
                </SelectTrigger>
            </Select>

            {/* 동행 인원 */}
            <Select>
                <SelectTrigger className="gap-6 pl-7 pr-[18px] py-4 h-auto">
                    <div className="flex gap-5">
                        <img
                            src="/icon/home/groupIcon.svg"
                            alt="그룹 아이콘"
                            className="w-[17px]"
                        />
                        <SelectValue
                            placeholder="동행 인원"
                            className="font-normal text-[#999999] text-base tracking-[-0.02px]"
                        />
                    </div>
                </SelectTrigger>
            </Select>

            {/* 선호 정보 */}
            <Select>
                <SelectTrigger className="gap-6 pl-7 pr-[18px] py-4 h-auto">
                    <div className="flex gap-5">
                        <img
                            src="/icon/home/smileIcon.svg"
                            alt="스마일 아이콘"
                            className="w-[17px]"
                        />
                        <SelectValue
                            placeholder="선호 정보"
                            className="font-normal text-[#999999] text-base"
                        />
                    </div>
                </SelectTrigger>
            </Select>

            {/* 검색 버튼 */}
            <Button
                variant="default"
                className="gap-9 px-8 py-4 h-auto font-semibold text-base"
            >
                검색
            </Button>
        </div>
    );
}
