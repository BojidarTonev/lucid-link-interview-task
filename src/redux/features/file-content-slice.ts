import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    content: '',
    loading: false,
    error: null,
    selectedFileName: '',
    deleteFileName: '',
    uploadFileDirectory: ''
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
        setUploadFileDirectory: (state, action: PayloadAction<string>) => {
            state.uploadFileDirectory = action.payload;
        },
        clearFileContent: (state) => {
            state.content = '';
            state.selectedFileName = '';
            state.deleteFileName = '';
            state.uploadFileDirectory = '';
            state.error = null;
            state.loading = false;
        },
    },
});

export const {
    setLoading,
    setContent,
    setError,
    setSelectedFileName,
    clearFileContent,
    setDeleteFileName,
    setUploadFileDirectory
} = fileContentSlice.actions;

export default fileContentSlice.reducer;