import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {encryptData} from "../../utils/s3-utils.ts";

export interface IS3Credentials {
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    region: string,
}

interface S3ClientState {
    encryptedConfig: string | null;
}

const initialState: S3ClientState = {
    encryptedConfig: null,
};

export const s3ClientSlice = createSlice({
    name: 's3Client',
    initialState,
    reducers: {
        setS3ClientConfig(state, action: PayloadAction<IS3Credentials>) {
            state.encryptedConfig = encryptData(action.payload);
        },
        clearS3ClientConfig(state) {
            state.encryptedConfig = null;
        },
    },
});

export const { setS3ClientConfig, clearS3ClientConfig } = s3ClientSlice.actions;

export default s3ClientSlice.reducer;