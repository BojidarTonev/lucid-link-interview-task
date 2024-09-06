import {useMemo} from 'react';
import {IS3Credentials} from '../redux/features/s3ClientSlice';
import {useAppSelector} from "../redux/store.ts";
import S3ClientSingleton from "../s3-client-singleton.ts";

const useS3Auth = () => {
    const { config } = useAppSelector((state) => state.s3Client);

    return useMemo(() => {
        if (!config) {
            return false;
        }
        return !!S3ClientSingleton.getInstance(config as IS3Credentials);
    }, [config]);
};

export default useS3Auth;