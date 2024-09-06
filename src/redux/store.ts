import { configureStore } from '@reduxjs/toolkit';
import {persistReducer, persistStore} from "redux-persist";
import { s3Api } from './services/s3-api.ts';
import fileContentReducer from './features/file-content-slice.ts';
import modalReducer from './features/modal-slice.ts';
import s3ClientReducer, {s3ClientSlice} from './features/s3-client-slice.ts';
import storage from 'redux-persist/lib/storage';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const s3ClientPersistConfig = {
    key: s3ClientSlice.name,
    storage,
    whitelist: [s3ClientSlice.name],
};

const persistedS3ClientReducer = persistReducer(s3ClientPersistConfig, s3ClientReducer);

export const store = configureStore({
    reducer: {
        // slices
        fileContent: fileContentReducer,
        modal: modalReducer,
        [s3ClientSlice.name]: persistedS3ClientReducer,
        // services
        [s3Api.reducerPath]: s3Api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(s3Api.middleware),
});

export const persistor = persistStore(store);

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const useAppDispatch = () => useDispatch<AppDispatch>();

export {
    useAppSelector,
    useAppDispatch,
};

export default store;