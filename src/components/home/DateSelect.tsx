'use client';

import { Calendar } from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function DateSelect() {
    const [date, setDate] = useState<Date | undefined>(undefined);

    const formatDate = (date: Date | undefined) => {
        if (!date) {
            return '날짜 선택';
        } else {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${date.getFullYear()}/${month}/${day}`;
        }
    };

    return (
        <>
            <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue
                        placeholder={date ? formatDate(date) : '날짜 선택'}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <Calendar
                            mode="single"
                            onSelect={setDate}
                            className="rounded-md border shadow"
                        />
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    );
}
