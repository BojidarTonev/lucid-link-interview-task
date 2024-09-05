import S3ClientSingleton from '../s3ClientSingleton.ts';

const checkAuthentication = () => {
    const isAuthenticated = S3ClientSingleton.getInstance();
    return !!isAuthenticated;
};

export {
    checkAuthentication
}