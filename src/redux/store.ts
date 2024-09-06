import { configureStore } from '@reduxjs/toolkit';
import {persistReducer, persistStore} from "redux-persist";
import { s3Api } from './services/s3-api.ts';
import fileContentReducer from './features/fileContentSlice.ts';
import modalReducer from './features/modalSlice.ts';
import s3ClientReducer, {s3ClientSlice} from './features/s3ClientSlice.ts';
import storage from 'redux-persist/lib/storage';

const s3ClientPersistConfig = {
    key: 's3Client',
    storage,
    whitelist: [s3ClientSlice.name],
};

const persistedS3ClientReducer = persistReducer(s3ClientPersistConfig, s3ClientReducer);

export const store = configureStore({
    reducer: {
        // slices
        fileContent: fileContentReducer,
        modal: modalReducer,
        s3Client: persistedS3ClientReducer,
        // services
        [s3Api.reducerPath]: s3Api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Prevent warnings with redux-persist
            },
        }).concat(s3Api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;