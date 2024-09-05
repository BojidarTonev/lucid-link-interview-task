import { S3Client } from '@aws-sdk/client-s3';
import {IS3Credentials} from "./redux/features/authSlice.ts";


class S3ClientSingleton {
    private static instance: S3Client | null = null;
    private static config: IS3Credentials | null = null;

    private constructor() {}

    public static getInstance(config?: IS3Credentials): S3Client {
        if (config) {
            if (!S3ClientSingleton.instance) {
                S3ClientSingleton.config = config;
                S3ClientSingleton.instance = new S3Client({
                    region: config.region,
                    credentials: {
                        accessKeyId: config.accessKeyId,
                        secretAccessKey: config.secretAccessKey,
                    },
                });
            } else if (S3ClientSingleton.config !== config) {
                // throw new Error('S3Client instance already created with different configuration');
            }
            return S3ClientSingleton.instance;
        } else if (!S3ClientSingleton.instance) {
            // throw new Error('S3Client configuration is not set. Please provide configuration.');
        }
        return S3ClientSingleton.instance;
    }

    public static clearInstance() {
        S3ClientSingleton.instance = null;
        S3ClientSingleton.config = null;
    }
}

export default S3ClientSingleton;