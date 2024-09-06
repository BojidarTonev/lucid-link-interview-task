import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from "redux-persist";
import { s3Api } from './services/s3-api.ts';
import fileContentReducer from './features/file-content-slice.ts';
import modalReducer from './features/modal-slice.ts';
import s3ClientReducer, {s3ClientSlice} from './features/s3-client-slice.ts';
import storage from 'redux-persist/lib/storage';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    // slices
    fileContent: fileContentReducer,
    modal: modalReducer,
    [s3ClientSlice.name]: s3ClientReducer,
    // services
    [s3Api.reducerPath]: s3Api.reducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
    key: 'root',
    storage,
    whitelist: reducersToPersist,
});

const persistRootReducer = persistReducer(persistConfig([s3ClientSlice.name]), rootReducer);

export const store = configureStore({
    reducer: persistRootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(s3Api.middleware),
});

const persistor = persistStore(store);

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

export {
    persistor,
    useAppSelector,
    useAppDispatch,
};