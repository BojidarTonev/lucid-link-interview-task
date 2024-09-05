import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IS3Credentials {
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    region: string,
}

const initialState = {
    credentials: {
        accessKeyId: '',
        secretAccessKey: '',
        bucketName: '',
        region: '',
    },
    isAuthenticated: false,
    isLoading: false,
    hasError: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setCredentialsData: (state, action: PayloadAction<IS3Credentials>) => {
            state.credentials = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setHasError: (state, action: PayloadAction<boolean>) => {
            state.hasError = action.payload;
        },
        clearAuthData: (state) => {
            state.credentials = {
                accessKeyId: '',
                secretAccessKey: '',
                bucketName: '',
                region: '',
            }
            state.isAuthenticated = false;
            state.isLoading = false;
            state.hasError = false;
        }
    },
});

export const { setIsAuthenticated, setCredentialsData, setIsLoading, setHasError, clearAuthData } = authSlice.actions;

export default authSlice.reducer;