export interface IFileStructure {
    files: string[],
    path: string,
    [key: string]: IFileStructure | string[] | string;
}

const transformFilesToTreeStructure = (filesArray: string[]) => {
    return filesArray.reduce((acc: IFileStructure, filePath: string) => {
        const parts = filePath.split('/');
        let currentLevel = acc;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;

            if (isFile) {
                currentLevel.files = currentLevel.files || [];
                currentLevel.files.push(part);
            } else {
                currentLevel[part] = currentLevel[part] || { files: [], path: `${(currentLevel.path || '')}${part}/` };
                currentLevel = currentLevel[part] as IFileStructure;
            }
        });

        return acc;
    }, { files: [], path: '/' });
};

const readStreamToText = async (
    response: { Body?: any }
): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = response.Body;

            if (!body) {
                reject(new Error('No response body found.'));
                return;
            }

            // Handle Node.js environment (IncomingMessage & SdkStreamMixin)
            if (typeof body.pipe === 'function') {
                const chunks: Buffer[] = [];
                body.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });
                body.on('end', () => {
                    const responseBody = Buffer.concat(chunks).toString('utf-8');
                    resolve(responseBody);
                });
                body.on('error', reject);
            }
            // Handle browser environment (ReadableStream)
            else if (body instanceof ReadableStream) {
                const reader = body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        function push() {
                            reader
                                .read()
                                .then(({ done, value }) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    controller.enqueue(value);
                                    push();
                                })
                                .catch(reject);
                        }
                        push();
                    },
                });

                const responseBody = await new Response(stream).text();
                resolve(responseBody);
            }
            // Handle Blob in browser
            else if (body instanceof Blob) {
                const responseBody = await body.text();
                resolve(responseBody);
            }
            // Handle Buffer
            else if (Buffer.isBuffer(body)) {
                const responseBody = body.toString('utf-8');
                resolve(responseBody);
            } else {
                reject(new Error('Unsupported body type.'));
            }
        } catch (err) {
            reject(err);
        }
    });
};

export {
    transformFilesToTreeStructure,
    readStreamToText
}