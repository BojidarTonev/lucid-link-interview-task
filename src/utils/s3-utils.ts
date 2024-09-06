import S3ClientSingleton from "../s3-client-singleton.ts";
import { IS3Credentials } from "../redux/features/s3ClientSlice.ts";

export const getS3ClientAndConfig = (getState: () => any) => {
    const state = getState();
    const config = state.s3Client.config;

    if (!config) {
        throw new Error('S3 configuration is not available.');
    }

    const s3Client = S3ClientSingleton.getInstance(config as IS3Credentials);
    const bucketName = config.bucketName;

    if (!bucketName) {
        throw new Error('Bucket name is not specified.');
    }

    return { s3Client, config, bucketName };
};