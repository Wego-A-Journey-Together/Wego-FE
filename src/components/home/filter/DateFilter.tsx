'use client';

import { ScrollCalender } from '@/components/home/filter/ScrollCalender';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDateAction } from '@/redux/slices/filterSlice';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';

export const DateFilter = () => {
    const date = useAppSelector((state) => state.filter.date);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 1200px)');

    const fromDate = date?.from ? new Date(date.from) : null;
    const toDate = date?.to ? new Date(date.to) : null;

    if (isMobile) {
        return (
            <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold">날짜 지정</h3>
                    <ScrollCalender />
                </div>
            </div>
        );
    }

    return (
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
                    {fromDate ? (
                        toDate ? (
                            <span className="mr-auto text-base font-normal">
                                {format(fromDate, 'MM.dd E', { locale: ko })} -{' '}
                                {format(toDate, 'MM.dd E', { locale: ko })} (
                                {Math.ceil(
                                    (toDate.getTime() - fromDate.getTime()) /
                                        (1000 * 60 * 60 * 24),
                                )}
                                박)
                            </span>
                        ) : (
                            <span className="mr-auto text-base font-normal">
                                {format(fromDate, 'MM.dd E', { locale: ko })}
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
                    defaultMonth={fromDate || undefined}
                    selected={
                        fromDate
                            ? { from: fromDate, to: toDate || undefined }
                            : undefined
                    }
                    onSelect={(newDate) => dispatch(setDateAction(newDate))}
                    numberOfMonths={1}
                    locale={ko}
                />
            </PopoverContent>
        </Popover>
    );
};
