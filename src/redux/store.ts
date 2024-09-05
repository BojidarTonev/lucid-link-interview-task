import { configureStore } from '@reduxjs/toolkit';
import { s3Api } from './services/s3-api.ts';
import fileContentReducer from './features/fileContentSlice.ts';
import modalReducer from './features/modalSlice.ts';
import authReducer from './features/authSlice.ts';
import s3ClientReducer from './features/s3ClientSlice.ts';

export const store = configureStore({
    reducer: {
        // slices
        fileContent: fileContentReducer,
        modal: modalReducer,
        auth: authReducer,
        s3Client: s3ClientReducer,
        // services
        [s3Api.reducerPath]: s3Api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(s3Api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;