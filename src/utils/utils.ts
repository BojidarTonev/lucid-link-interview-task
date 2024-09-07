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
            else if (body instanceof Blob) {
                const responseBody = await body.text();
                resolve(responseBody);
            } else {
                reject(new Error('Unsupported body type.'));
            }
        } catch (err) {
            reject(err);
        }
    });
};

const isDeletePathContainedInFilePath = (deletePath: string, filePath: string): boolean => {
    const normalizedDeletePath = deletePath.replace(/^\/+/, '').replace(/\/+$/, '');
    const normalizedFilePath = filePath.replace(/^\/+/, '').replace(/\/+$/, '');

    return normalizedFilePath.startsWith(normalizedDeletePath) &&
        (normalizedFilePath === normalizedDeletePath || normalizedFilePath[normalizedDeletePath.length] === '/');
};

const collectAllFilesAndDirectories = (node: IFileStructure, fullPath: string, result: string[] = []): string[] => {
    if (node.files) {
        node.files.forEach(file => {
            result.push(`${fullPath}${file}`.replace(/\/+/g, '/'));
        });
    }

    Object.entries(node).forEach(([key, value]) => {
        if (typeof value === 'object' && key !== 'path' && key !== 'files') {
            collectAllFilesAndDirectories(value as IFileStructure, `${fullPath}${key}/`, result);
        }
    });

    return result.map(el => el.replace(/^\//, ''));
};

export {
    transformFilesToTreeStructure,
    readStreamToText,
    isDeletePathContainedInFilePath,
    collectAllFilesAndDirectories
}