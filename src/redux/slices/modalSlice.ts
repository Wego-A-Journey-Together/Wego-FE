import { createSlice } from '@reduxjs/toolkit';





const modalSlice = createSlice({
    name: 'ui',
    initialState: {
        loginModalOpen: false,
    },
    reducers: {
        openLoginModal: (state) => {
            state.loginModalOpen = true;
        },
        closeLoginModal: (state) => {
            state.loginModalOpen = false;
        },
    },
});

export const { openLoginModal, closeLoginModal } = modalSlice.actions;
export default modalSlice.reducer;
