import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IS3Credentials {
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    region: string,
}

interface S3ClientState {
    config: IS3Credentials | null;
}

const initialState: S3ClientState = {
    config: null,
};

export const s3ClientSlice = createSlice({
    name: 's3Client',
    initialState,
    reducers: {
        setS3ClientConfig(state, action: PayloadAction<IS3Credentials>) {
            state.config = action.payload;
        },
        clearS3ClientConfig(state) {
            state.config = null;
        },
    },
});

export const { setS3ClientConfig, clearS3ClientConfig } = s3ClientSlice.actions;

export default s3ClientSlice.reducer;