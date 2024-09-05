import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    content: '',
    loading: false,
    error: null,
    selectedFileName: ''
};

const fileContentSlice = createSlice({
    name: 'fileContent',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setContent: (state, action) => {
            state.content = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setSelectedFileName: (state, action) => {
            state.selectedFileName = action.payload
        },
        clearContent: (state) => {
            state.content = '';
            state.error = null;
            state.loading = false;
        },
    },
});

export const { setLoading, setContent, setError, setSelectedFileName, clearContent } = fileContentSlice.actions;

export default fileContentSlice.reducer;