'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('w-[250px] p-3', className)}
            formatters={{
                // 영문으로 월, 요일을 표시
                formatWeekdayName: (weekday) =>
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                        weekday.getDay()
                    ],
                formatCaption: (date) => {
                    const months = [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                    ];
                    return `${months[date.getMonth()]} ${date.getFullYear()}`;
                },
            }}
            classNames={{
                months: 'flex flex-col sm:flex-row gap-2 ',
                month: 'flex flex-col gap-4 w-[250px]',
                caption:
                    'flex justify-center pt-1 relative items-center w-full',
                caption_label: 'text-sm font-medium',
                nav: 'flex items-center gap-1',
                nav_button: cn(
                    'w-4 h-4 bg-transparent hover:bg-transparent flex items-center justify-center p-0 cursor-pointer',
                ),
                nav_button_previous: 'absolute left-2',
                nav_button_next: 'absolute right-2',
                table: 'w-[250px] border-collapse',
                head_row: 'grid grid-cols-7 w-full',
                head_cell:
                    'text-foreground rounded-md font-semibold text-[0.8rem] flex justify-center',
                row: 'grid grid-cols-7 w-full mt-2',
                cell: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                    props.mode === 'range'
                        ? '[&:has(>.day-range-end)]:rounded-r-lg [&:has(>.day-range-start)]:rounded-l-lg first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg'
                        : '[&:has([aria-selected])]:rounded-lg',
                ),
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-8 p-0 font-medium aria-selected:opacity-100',
                ),
                day_range_start:
                    'day-range-start aria-selected:bg-sky-blue aria-selected:text-primary-foreground rounded-l-lg',
                day_range_end:
                    'day-range-end aria-selected:bg-sky-blue aria-selected:text-primary-foreground rounded-r-lg',
                day_selected:
                    'bg-sky-blue text-primary-foreground hover:bg-sky-blue hover:text-primary-foreground focus:bg-sky-blue focus:text-primary-foreground rounded-lg',
                day_today: 'bg-accent text-accent-foreground',
                day_outside:
                    'day-outside aria-selected:text-muted-foreground text-[#999999]',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle:
                    'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: ({ className, ...props }) => (
                    <Image
                        src="/icon/home/prevMonth.svg"
                        alt="Previous Month"
                        width={16}
                        height={16}
                        className={cn('size-4', className)}
                        {...props}
                    />
                ),
                IconRight: ({ className, ...props }) => (
                    <Image
                        src="/icon/home/nextMonth.svg"
                        alt="Next Month"
                        width={16}
                        height={16}
                        className={cn('size-4', className)}
                        {...props}
                    />
                ),
            }}
            {...props}
        />
    );
}

export { Calendar };
