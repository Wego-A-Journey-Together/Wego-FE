'use client';

import FilterSelector from '@/components/home/FilterSelector';
import { RecruitingCheckbox } from '@/components/home/filter/RecruitingCheckbox';
import { useLocale } from '@/hooks/useLocale';

interface Props {
    totalCount: string | number;
}

export default function HomeSearch({ totalCount }: Props) {
    const { t } = useLocale();
    return (
        <>
            {/* 필터링 영역 */}
            <h1 className="mt-[75px] mb-[26px] text-base font-semibold sm:text-2xl">
                {t.find}
            </h1>
            <FilterSelector />
            <section className="mt-[30px] flex items-center text-sm text-[#808080]">
                <h2>
                    {t.result} <span className="font-bold">{totalCount}</span>
                    {t.count}
                </h2>
                <RecruitingCheckbox />
            </section>
        </>
    );
}
