interface ITestStructure {
    files: string[],
    path: string
}

const transformFilesToTreeStructure = (filesArray: string[]) => {
    return filesArray.reduce((acc: ITestStructure, filePath: string) => {
        const parts = filePath.split('/');
        let currentLevel = acc;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;

            if (isFile) {
                currentLevel.files = currentLevel.files || [];
                currentLevel.files.push(part);
            } else {
                currentLevel[part] = currentLevel[part] || { files: [], path: `${(currentLevel.path || '')}${part}/` };
                currentLevel = currentLevel[part];
            }
        });

        return acc;
    }, { files: [], path: '/' });
};

export {
    transformFilesToTreeStructure,
}