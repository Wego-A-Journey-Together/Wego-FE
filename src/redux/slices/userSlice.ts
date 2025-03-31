import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserState {
    info: {
        kakaoId: string;
        nickname: string;
        email?: string;
    } | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    info: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserState['info']>) => {
            state.info = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        clearUserInfo: (state) => {
            state.info = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
