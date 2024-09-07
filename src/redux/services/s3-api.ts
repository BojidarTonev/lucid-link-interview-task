import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    ListObjectsCommand,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    PutObjectCommandOutput, DeleteObjectCommandOutput
} from '@aws-sdk/client-s3';
import {setContent, setError, setLoading} from "../features/file-content-slice.ts";
import {
    IFileStructure,
    readStreamToText,
    transformFilesToTreeStructure
} from "../../utils/utils.ts";
import {getS3ClientAndConfig} from "../../utils/s3-utils.ts";

export const s3Api = createApi({
    reducerPath: 's3Api',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['files'],
    endpoints: (builder) => ({
        getFiles: builder.query<IFileStructure, object>({
            queryFn: async (_, { getState }) => {
                try {
                    const { s3Client, bucketName } = getS3ClientAndConfig(() => getState());

                    const command = new ListObjectsCommand({ Bucket: bucketName });
                    const data = await s3Client.send(command);
                    const files = data.Contents?.map(item => item.Key ?? '') ?? [];
                    const structuredFiles = transformFilesToTreeStructure(files);
                    return { data: structuredFiles };
                } catch (err: any) {
                    return { error: err?.message };
                }
            },
            providesTags: ['files']
        }),
        getFileContent: builder.query<string, string>({
            queryFn: async (key, api) => {
                api.dispatch(setLoading(true));
                try {
                    const { s3Client, bucketName } = getS3ClientAndConfig(() => api.getState());

                    const command = new GetObjectCommand({
                        Bucket: bucketName,
                        Key: key,
                    });
                    const response = await s3Client.send(command);
                    const bodyContents = await readStreamToText(response);

                    api.dispatch(setContent(bodyContents));
                    api.dispatch(setLoading(false));

                    return { data: bodyContents };
                } catch (err: any) {
                    api.dispatch(setError(err?.message));
                    api.dispatch(setLoading(false));

                    return { error: err?.message };
                }
            },
        }),
        uploadFile: builder.mutation<PutObjectCommandOutput, {fileName: string, fileContent: string}>({
            queryFn: async ({ fileName, fileContent }, { getState }) => {
                try {
                    const { s3Client, bucketName } = getS3ClientAndConfig(() => getState());

                    const command = new PutObjectCommand({
                        Bucket: bucketName,
                        Key: fileName,
                        Body: fileContent,
                        ContentType: 'text/plain',
                    });

                    const response = await s3Client.send(command);
                    return { data: response };
                } catch (err: any) {
                    return { error: err?.message };
                }
            },
            invalidatesTags: ['files']
        }),
        uploadDirectory: builder.mutation<PutObjectCommandOutput, { directoryName: string }>({
            queryFn: async ({ directoryName }, { getState }) => {
                try {
                    const { s3Client, bucketName } = getS3ClientAndConfig(() => getState());

                    const placeholderFileName = `${directoryName}/.placeholder`;
                    const command = new PutObjectCommand({
                        Bucket: bucketName,
                        Key: placeholderFileName,
                        Body: '', // Empty body for placeholder
                        ContentType: 'text/plain',
                    });

                    const response = await s3Client.send(command);
                    return { data: response };
                } catch (err: any) {
                    return { error: err?.message };
                }
            },
            invalidatesTags: ['files']
        }),
        deleteFile: builder.mutation<DeleteObjectCommandOutput, { fileName: string }>({
            queryFn: async ({ fileName }, { getState }) => {
                try {
                    const { s3Client, bucketName } = getS3ClientAndConfig(() => getState());

                    const command = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: fileName,
                    });

                    const response = await s3Client.send(command);
                    return { data: response };
                } catch (err: any) {
                    return { error: err?.message };
                }
            },
            invalidatesTags: ['files']
        }),
        deleteDirectory: builder.mutation<void, string[]>({
            queryFn: async (fileKeys, { getState }) => {
                try {
                    const { s3Client, bucketName } = getS3ClientAndConfig(() => getState());

                    await Promise.all(fileKeys.map(fileKey => {
                        const command = new DeleteObjectCommand({
                            Bucket: bucketName,
                            Key: fileKey,
                        });
                        return s3Client.send(command);
                    }));

                    return { data: undefined };
                } catch (err: any) {
                    return { error: err?.message };
                }
            },
            invalidatesTags: ['files']
        }),
    })
});

export const {
    useGetFilesQuery,
    useLazyGetFileContentQuery,
    useUploadFileMutation,
    useDeleteFileMutation,
    useUploadDirectoryMutation,
    useDeleteDirectoryMutation,
} = s3Api;