import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface S3ClientConfig {
    accessKeyId: string;
    secretAccessKey: string;
    regionName: string;
    bucketName: string;
}

interface S3ClientState {
    config: S3ClientConfig | null;
}

const initialState: S3ClientState = {
    config: null,
};

const s3ClientSlice = createSlice({
    name: 's3Client',
    initialState,
    reducers: {
        setS3ClientConfig(state, action: PayloadAction<S3ClientConfig>) {
            state.config = action.payload;
        },
        clearS3ClientConfig(state) {
            state.config = null;
        },
    },
});

export const { setS3ClientConfig, clearS3ClientConfig } = s3ClientSlice.actions;

export default s3ClientSlice.reducer;