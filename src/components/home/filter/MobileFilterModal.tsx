'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeModal, startClosingModal } from '@/redux/slices/filterSlice';
import { X } from 'lucide-react';

import { DateFilter } from './DateFilter';
import { GenderAndAgeFilter } from './GenderAndAgeFilter';
import { GroupSizeFilter } from './GroupSizeFilter';
import { GroupThemeFilter } from './GroupThemeFilter';
import { LocationFilter } from './LocationFilter';
import { SearchButton } from './SearchButton';

interface MobileFilterModalProps {
    onSearch: () => void;
}

export const MobileFilterModal = ({ onSearch }: MobileFilterModalProps) => {
    const dispatch = useAppDispatch();
    const { isModalOpen, isModalClose } = useAppSelector(
        (state) => state.filter,
    );

    // 모달 닫기 함수
    const handleClose = () => {
        dispatch(startClosingModal());
        setTimeout(() => {
            dispatch(closeModal());
        }, 300);
    };

    // 모달 열려있지 않으면 렌더링하지 않음
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50" onClick={handleClose}>
            <div
                className={`fixed right-0 bottom-0 left-0 z-50 h-screen w-full overflow-y-auto bg-white p-6 transition-all duration-300 ${
                    isModalClose
                        ? 'translate-y-full'
                        : 'animate-in slide-in-from-bottom translate-y-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="mb-6 flex h-[60px] w-full items-center">
                    <button
                        className="flex h-6 w-6 items-center justify-center"
                        onClick={handleClose}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="flex-1 text-center text-2xl font-semibold">
                        동행글 찾기
                    </div>
                    <div className="h-6 w-6"></div>
                </header>

                <div className="flex w-full flex-col gap-6">
                    <LocationFilter />
                    <DateFilter />
                    <GroupThemeFilter />
                    <GroupSizeFilter />
                    <GenderAndAgeFilter />
                    <SearchButton onSearch={onSearch} />
                </div>
            </div>
        </div>
    );
};
