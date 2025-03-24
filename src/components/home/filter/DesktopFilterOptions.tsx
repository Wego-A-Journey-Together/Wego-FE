'use client';

import { DateFilter } from './DateFilter';
import { GenderAndAgeFilter } from './GenderAndAgeFilter';
import { GroupSizeFilter } from './GroupSizeFilter';
import { GroupThemeFilter } from './GroupThemeFilter';
import { LocationFilter } from './LocationFilter';
import { SearchButton } from './SearchButton';

interface DesktopFilterOptionsProps {
    onSearch: () => void;
}

export const DesktopFilterOptions = ({
    onSearch,
}: DesktopFilterOptionsProps) => {
    return (
        <div className="flex w-full flex-wrap justify-between">
            <LocationFilter />
            <DateFilter />
            <GroupThemeFilter />
            <GroupSizeFilter />
            <GenderAndAgeFilter />
            <SearchButton onSearch={onSearch} />
        </div>
    );
};
