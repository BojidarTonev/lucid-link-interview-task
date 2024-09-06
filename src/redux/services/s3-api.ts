import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import {setContent, setError, setLoading} from "../features/fileContentSlice.ts";
import {transformFilesToTreeStructure} from "../../utils.ts";
import {RootState} from "../store.ts";
import S3ClientSingleton from "../../s3ClientSingleton.ts";

export const s3Api = createApi({
    reducerPath: 's3Api',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getFiles: builder.query({
            queryFn: async (_, { getState }) => {
                const state = getState() as RootState;
                const config = state.s3Client.config;

                if (!config) {
                    return { error: 'S3 configuration is not available.' };
                }

                try {
                    const s3Client = S3ClientSingleton.getInstance(config);

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
                    const state = api.getState() as RootState;
                    const config = state.s3Client.config;

                    if (!config) {
                        return { error: 'S3 configuration is not available.' };
                    }

                    try {
                        const s3Client = S3ClientSingleton.getInstance(config);

                        const bucketName = config.bucketName;
                        if (!bucketName) {
                            return { error: 'Bucket name is not specified.' };
                        }
                        const command = new GetObjectCommand({
                            Bucket: bucketName,
                            Key: key,
                        });
                        const response = await s3Client.send(command);
                        const bodyContents = await new Promise(async (resolve, reject) => {
                            try {
                                // Check if response.Body is a ReadableStream
                                const reader = response.Body?.getReader(); // Get a reader from the stream
                                if (!reader) {
                                    reject(new Error('Failed to get reader from stream'));
                                    return;
                                }

                                const stream = new ReadableStream({
                                    start(controller) {
                                        function push() {
                                            reader.read().then(({ done, value }) => {
                                                if (done) {
                                                    controller.close();
                                                    return;
                                                }
                                                controller.enqueue(value);
                                                push();
                                            }).catch(reject);
                                        }
                                        push();
                                    }
                                });

                                const responseBody = await new Response(stream).text(); // Convert stream to text
                                api.dispatch(setContent(responseBody));
                                resolve(responseBody);
                            } catch (err) {
                                reject(err);
                            }
                        });
                        api.dispatch(setContent(bodyContents));
                        return { data: bodyContents };
                    } catch (err) {
                        return { error: err?.message };
                    }
                } catch (err) {
                    api.dispatch(setError(err?.message));
                    return { error: err?.message };
                }
            },
        }),
    })
});

export const { useGetFilesQuery, useLazyGetFileContentQuery } = s3Api;