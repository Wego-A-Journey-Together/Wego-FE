'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

function ReponsiveCalender({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('w-full p-3', className)}
            classNames={{
                months: 'w-full max-w-[370px] mx-auto',
                month: 'w-full',
                caption:
                    'flex justify-center pt-1 relative items-center w-full mb-4',
                caption_label: 'text-lg font-medium',
                nav: 'flex items-center gap-1',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse',
                head_row: 'flex w-full justify-between border-b pb-2',
                head_cell: 'text-center w-10 font-normal text-sm py-2',
                row: 'flex w-full justify-between mt-2',
                cell: cn(
                    'relative p-0 text-center focus-within:relative focus-within:z-20',
                    props.mode === 'range'
                        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md'
                        : '[&:has([aria-selected])]:rounded-md',
                ),
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-10 p-0 font-normal aria-selected:opacity-100',
                ),
                day_range_start:
                    'day-range-start aria-selected:bg-sky-blue aria-selected:text-primary-foreground',
                day_range_end:
                    'day-range-end aria-selected:bg-sky-blue aria-selected:text-primary-foreground',
                day_selected:
                    'bg-sky-blue text-primary-foreground hover:bg-sky-blue hover:text-primary-foreground focus:bg-sky-blue focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside: 'day-outside text-muted-foreground opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle:
                    'aria-selected:bg-accent/20 aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft
                        className={cn('size-4', className)}
                        {...props}
                    />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight
                        className={cn('size-4', className)}
                        {...props}
                    />
                ),
            }}
            {...props}
        />
    );
}

export { ReponsiveCalender };
