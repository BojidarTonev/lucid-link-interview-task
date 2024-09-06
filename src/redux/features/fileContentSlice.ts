import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    content: '',
    loading: false,
    error: null,
    selectedFileName: '',
    deleteFileName: ''
};

const fileContentSlice = createSlice({
    name: 'fileContent',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setSelectedFileName: (state, action: PayloadAction<string>) => {
            state.selectedFileName = action.payload
        },
        setDeleteFileName: (state, action: PayloadAction<string>) => {
            state.deleteFileName = action.payload
        },
        clearContent: (state) => {
            state.content = '';
            state.selectedFileName = '';
            state.deleteFileName = '',
            state.error = null;
            state.loading = false;
        },
    },
});

export const { setLoading, setContent, setError, setSelectedFileName, clearContent, setDeleteFileName } = fileContentSlice.actions;

export default fileContentSlice.reducer;