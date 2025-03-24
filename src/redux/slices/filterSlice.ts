import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DateRange } from 'react-day-picker';

export interface dateRange {
    from: string | null;
    to: string | null;
}

export interface FilterState {
    location: string;
    date: dateRange | null;
    groupTheme: string;
    groupSize: string;
    gender: string;
    age: string;
    isOpen: boolean;
    isClosing: boolean;
}

const initialState: FilterState = {
    location: '',
    date: null,
    groupTheme: '',
    groupSize: '',
    gender: '',
    age: '',
    isOpen: false,
    isClosing: false,
};

// Date 객체를 직렬화 형태로 변환하는 함수 (렌더링 오류 수정)
const serializeDateRange = (
    dateRange: DateRange | undefined,
): dateRange | null => {
    if (!dateRange) return null;

    try {
        return {
            from:
                dateRange.from instanceof Date
                    ? dateRange.from.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                      })
                    : null,
            to:
                dateRange.to instanceof Date
                    ? dateRange.to.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                      })
                    : null,
        };
    } catch (error) {
        console.error('Error serializing date range:', error);
        return null;
    }
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<string>) => {
            state.location = action.payload;
        },
        setDate: (state, action: PayloadAction<dateRange | null>) => {
            state.date = action.payload;
        },
        setGroupTheme: (state, action: PayloadAction<string>) => {
            state.groupTheme = action.payload;
        },
        setPeople: (state, action: PayloadAction<string>) => {
            state.groupSize = action.payload;
        },
        setGender: (state, action: PayloadAction<string>) => {
            state.gender = action.payload;
        },
        setAge: (state, action: PayloadAction<string>) => {
            state.age = action.payload;
        },
        openModal: (state) => {
            state.isOpen = true;
            state.isClosing = false;
        },
        startClosingModal: (state) => {
            state.isClosing = true;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.isClosing = false;
        },
    },
});

export const {
    setLocation,
    setDate,
    setGroupTheme,
    setPeople,
    setGender,
    setAge,
    openModal,
    startClosingModal,
    closeModal,
} = filterSlice.actions;

// DateRange 객체를 받아 직렬화하여 액션을 디스패치하는 함수
export const setDateAction = (dateRange: DateRange | undefined) => {
    return setDate(serializeDateRange(dateRange));
};

export default filterSlice.reducer;
