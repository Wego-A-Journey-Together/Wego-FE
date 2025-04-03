import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DateRange } from 'react-day-picker';

export interface FilterState {
    location: string;
    startDate: string | null;
    endDate: string | null;
    groupTheme: string;
    groupSize: string;
    gender: string;
    age: string;
    isModalOpen: boolean;
    isModalClose: boolean;
    isGroupOpen: boolean;
}

const initialState: FilterState = {
    location: '',
    startDate: null,
    endDate: null,
    groupTheme: '',
    groupSize: '',
    gender: '',
    age: '',
    isModalOpen: false,
    isModalClose: false,
    isGroupOpen: false,
};

// UTC 형식으로 변환
const serializeDateRange = (
    dateRange: DateRange | undefined,
): { startDate: string | null; endDate: string | null } => {
    if (!dateRange) return { startDate: null, endDate: null };

    try {
        return {
            startDate:
                dateRange.from instanceof Date
                    ? dateRange.from.toISOString()
                    : null,
            endDate:
                dateRange.to instanceof Date
                    ? dateRange.to.toISOString()
                    : null,
        };
    } catch (error) {
        console.error('Error serializing date range:', error);
        return { startDate: null, endDate: null };
    }
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<string>) => {
            state.location = action.payload;
        },
        setStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload;
        },
        setGroupTheme: (state, action: PayloadAction<string>) => {
            state.groupTheme = action.payload;
        },
        setGroupSize: (state, action: PayloadAction<string>) => {
            state.groupSize = action.payload;
        },
        setGender: (state, action: PayloadAction<string>) => {
            state.gender = action.payload;
        },
        setAge: (state, action: PayloadAction<string>) => {
            state.age = action.payload;
        },
        setIsGroupOpen: (state, action: PayloadAction<boolean>) => {
            state.isGroupOpen = action.payload;
        },
        openModal: (state) => {
            state.isModalOpen = true;
            state.isModalClose = false;
        },
        startClosingModal: (state) => {
            state.isModalClose = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.isModalClose = false;
        },
    },
});

export const {
    setLocation,
    setStartDate,
    setEndDate,
    setGroupTheme,
    setGroupSize,
    setGender,
    setAge,
    openModal,
    startClosingModal,
    closeModal,
    setIsGroupOpen,
} = filterSlice.actions;

export const setStartDateAction = (dateRange: DateRange | undefined) => {
    const serialized = serializeDateRange(dateRange);
    return setStartDate(serialized.startDate || '');
};

export const setEndDateAction = (dateRange: DateRange | undefined) => {
    const serialized = serializeDateRange(dateRange);
    return setEndDate(serialized.endDate || '');
};

export default filterSlice.reducer;
