'use client';

import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/useMediaQuery';

export const SearchButton = ({ onSearch }: { onSearch: () => void }) => {
    const isMobile = useMediaQuery('(max-width: 1200px)');

    if (isMobile) {
        return (
            <div className="mt-6">
                <Button
                    variant="default"
                    className="w-full py-4 text-base font-semibold"
                    onClick={onSearch}
                >
                    검색하기
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="default"
            className="h-auto w-[92px] gap-9 px-8 py-4 text-base font-semibold"
            onClick={onSearch}
        >
            검색
        </Button>
    );
};
