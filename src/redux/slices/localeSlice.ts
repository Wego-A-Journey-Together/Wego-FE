import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type SupportedLocale = 'ko' | 'en';

interface LocaleState {
    current: SupportedLocale;
}

const initialState: LocaleState = {
    current: 'ko',
};

const localeSlice = createSlice({
    name: 'locale',
    initialState,
    reducers: {
        setLocale: (state, action: PayloadAction<SupportedLocale>) => {
            state.current = action.payload;
        },
    },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
export type { LocaleState };
