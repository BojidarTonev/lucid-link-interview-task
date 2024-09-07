import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IFileStructure} from "../../utils/utils.ts";

interface IFileContentState {
    content: string,
    loading: boolean,
    error: any,
    selectedFileName: string;
    deleteFileName: string;
    uploadFileDirectory: string;
    deleteNode: IFileStructure | null
}

const initialState: IFileContentState = {
    content: '',
    loading: false,
    error: null,
    selectedFileName: '',
    deleteFileName: '',
    uploadFileDirectory: '',
    deleteNode: null,
};

export const fileContentSlice = createSlice({
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
        setDeleteNode: (state, action: PayloadAction<IFileStructure>) => {
            state.deleteNode = action.payload;
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
    setDeleteNode,
    setUploadFileDirectory
} = fileContentSlice.actions;

export default fileContentSlice.reducer;