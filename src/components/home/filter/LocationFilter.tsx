'use client';

import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/useLocale';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLocation } from '@/redux/slices/filterSlice';
import Image from 'next/image';

export const LocationFilter = () => {
    const location = useAppSelector((state) => state.filter.location);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 1200px)');
    const { t } = useLocale();

    if (isMobile) {
        return (
            <div className="rounded-lg bg-[#F5F6F7] px-5 py-[30px]">
                <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-bold">동행지</h3>
                    <div className="inline-flex w-full gap-9 rounded-lg border border-solid border-[#e9e9e9] bg-white px-7 py-3">
                        <Image
                            src="/icon/home/pinIcon.svg"
                            alt="핀 아이콘"
                            width={17}
                            height={17}
                        />
                        <Input
                            className="h-auto border-0 p-0 tracking-[-0.02px] text-[#999999] shadow-none placeholder:text-[#999999] focus-visible:ring-0"
                            placeholder="동행지는 어디인가요?"
                            value={location}
                            onChange={(e) =>
                                dispatch(setLocation(e.target.value))
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="inline-flex max-w-[239px] gap-6 rounded-lg border border-solid border-[#e9e9e9] px-7 py-3 dark:border-0 dark:bg-[#070707]">
            <Image
                src="/icon/home/pinIcon.svg"
                alt="위치 아이콘"
                width={17}
                height={17}
            />
            <Input
                className="h-auto w-auto border-0 p-0 text-base font-medium tracking-[-0.02px] text-black shadow-none placeholder:text-[#999999] focus-visible:ring-0 dark:border-0"
                placeholder={t.filter.where}
                value={location}
                onChange={(e) => dispatch(setLocation(e.target.value))}
            />
        </div>
    );
};
