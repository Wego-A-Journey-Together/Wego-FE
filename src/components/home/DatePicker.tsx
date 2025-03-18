'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import * as React from 'react';

export default function DatePicker() {
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-[280px] justify-start text-left font-normal pl-7 pr-[18px] py-4 h-auto',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <Image
                        src="/icon/home/calenderIcon.svg"
                        alt="달력 아이콘"
                        width={17}
                        height={17}
                    />

                    {date ? (
                        format(date, 'PPP')
                    ) : (
                        <span>날짜는 언제인가요?</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
