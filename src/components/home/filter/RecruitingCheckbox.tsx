'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useLocale } from '@/hooks/useLocale';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setIsGroupOpen } from '@/redux/slices/filterSlice';

export const RecruitingCheckbox = () => {
    const dispatch = useAppDispatch();
    const isGroupOpen = useAppSelector((state) => state.filter.isGroupOpen);
    const { t } = useLocale();
    const handleCheckboxChange = (checked: boolean) => {
        dispatch(setIsGroupOpen(checked));
    };

    return (
        <>
            <Checkbox
                id="isGroupOpen"
                className="mr-1.5 ml-auto"
                checked={isGroupOpen}
                onCheckedChange={handleCheckboxChange}
            />
            <label
                htmlFor="isGroupOpen"
                className="cursor-pointer"
                onClick={() => dispatch(setIsGroupOpen(!isGroupOpen))}
            >
                {t.lookfor}
            </label>
        </>
    );
};
