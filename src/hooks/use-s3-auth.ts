import {useMemo} from 'react';
import {useAppSelector} from "../redux/store.ts";
import S3ClientSingleton from "../s3-client-singleton.ts";

const useS3Auth = () => {
    const { encryptedConfig } = useAppSelector((state) => state.s3Client);

    return useMemo(() => {
        if (!encryptedConfig) {
            return false;
        }
        return !!S3ClientSingleton.getInstance(encryptedConfig);
    }, [encryptedConfig]);
};

export default useS3Auth;