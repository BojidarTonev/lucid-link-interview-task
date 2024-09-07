import CryptoJS from 'crypto-js';
import S3ClientSingleton from "../s3-client-singleton.ts";
import { IS3Credentials } from "../redux/features/s3-client-slice.ts";

const ENCRYPTION_KEY = 'testtest';

export const getS3ClientAndConfig = (getState: () => any) => {
    const state = getState();
    const encryptedConfig = state.s3Client.encryptedConfig;

    if (!encryptedConfig) {
        throw new Error('S3 configuration is not available.');
    }

    const config = decryptData(encryptedConfig);

    if (!config) {
        throw new Error('Decryption failed or configuration is invalid.');
    }

    const s3Client = S3ClientSingleton.getInstance(encryptedConfig);

    if (!config.bucketName) {
        throw new Error('Bucket name is not specified.');
    }

    const bucketName = config.bucketName;

    if (!bucketName) {
        throw new Error('Bucket name is not specified.');
    }

    return { s3Client, config, bucketName: config.bucketName };
};

export const encryptData = (data: IS3Credentials): string => {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): IS3Credentials | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedData) {
            return JSON.parse(decryptedData) as IS3Credentials;
        }
        return null;
    } catch (error) {
        console.error('Failed to decrypt data:', error);
        return null;
    }
};