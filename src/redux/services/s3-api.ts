import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import {setContent, setError, setLoading} from "../features/fileContentSlice.ts";
import {readStreamToText, transformFilesToTreeStructure} from "../../utils/utils.ts";
import {RootState} from "../store.ts";
import {getS3ClientAndConfig} from "../../utils/s3-utils.ts";

export const s3Api = createApi({
    reducerPath: 's3Api',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getFiles: builder.query({
            queryFn: async (_, { getState }) => {
                try {
                    const { s3Client, config } = getS3ClientAndConfig(() => getState() as RootState);

                    const bucketName = config.bucketName;
                    if (!bucketName) {
                        return { error: 'Bucket name is not specified.' };
                    }
                    const command = new ListObjectsCommand({ Bucket: bucketName });
                    const data = await s3Client.send(command);
                    const files = data.Contents?.map(item => item.Key ?? '') ?? [];
                    const structuredFiles = transformFilesToTreeStructure(files);
                    return { data: structuredFiles };
                } catch (err) {
                    return { error: err?.message };
                }
            },
        }),
        getFileContent: builder.query({
            queryFn: async (key, api) => {
                api.dispatch(setLoading(true));
                try {
                    const { s3Client, config } = getS3ClientAndConfig(() => api.getState() as RootState);

                    const bucketName = config.bucketName;
                    if (!bucketName) {
                        return { error: 'Bucket name is not specified.' };
                    }
                    const command = new GetObjectCommand({
                        Bucket: bucketName,
                        Key: key,
                    });
                    const response = await s3Client.send(command);
                    const bodyContents = await readStreamToText(response);
                    api.dispatch(setContent(bodyContents));
                    return { data: bodyContents };
                } catch (err) {
                    api.dispatch(setError(err?.message));
                    return { error: err?.message };
                }
            },
        }),
    })
});

export const { useGetFilesQuery, useLazyGetFileContentQuery } = s3Api;