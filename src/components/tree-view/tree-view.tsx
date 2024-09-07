import {FC, MouseEvent, useMemo, useState} from "react";
import {
    setDeleteFileName, setDeleteNode,
    setSelectedFileName,
    setUploadFileDirectory
} from "../../redux/features/file-content-slice.ts";
import { useLazyGetFileContentQuery } from "../../redux/services/s3-api.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faFolderPlus, faPlus, faTrash, faFolderMinus } from '@fortawesome/free-solid-svg-icons';
import { ModalTypes, openModal } from "../../redux/features/modal-slice.ts";
import { useAppDispatch, useAppSelector } from "../../redux/store.ts";
import { IFileStructure } from "../../utils/utils.ts";
import './tree-view.css';

interface ITreeViewProps {
    data: IFileStructure
}

interface ITreeNodeProps {
    node: IFileStructure,
    label: string,
    fullPath: string
}

const TreeNode: FC<ITreeNodeProps> = ({ node, label, fullPath }) => {
    const dispatch = useAppDispatch();
    const [trigger] = useLazyGetFileContentQuery();
    const { selectedFileName } = useAppSelector((state) => state.fileContent);
    const [isOpen, setIsOpen] = useState(false);

    const isObject = node && typeof node === "object" && !Array.isArray(node);

    const isEmptyDirectory = useMemo(() => {
        return node.files.length === 1 && node.files[0] === '.placeholder' && Object.keys(node).length === 2;
    }, [node]);

    const handleFileDoubleClick = (fileName: string) => {
        if (!fileName) {
            return;
        }
        const fullFilePath = `${fullPath}${fileName}`.replace(/^\//, '');
        trigger(fullFilePath);
        dispatch(setSelectedFileName(fullFilePath));
    };

    const onAddElementClick = (e: MouseEvent<SVGSVGElement>, directory: string) => {
        e.stopPropagation();

        dispatch(setUploadFileDirectory(directory));
        dispatch(openModal({ title: 'ADD FILE TO:', subTitle: fullPath, modalType: ModalTypes.AddFileModal }));
    }

    const onAddDirectoryClick = (e: MouseEvent<SVGSVGElement>, directory: string) => {
        e.stopPropagation();

        dispatch(setUploadFileDirectory(directory));
        dispatch(openModal({ title: 'ADD DIRECTORY TO:', subTitle: fullPath, modalType: ModalTypes.AddDirectoryModal }));
    }

    const onDeleteElementClick = (e: MouseEvent<SVGSVGElement>, fileName: string) => {
        e.stopPropagation();
        const fileFullName = `${fullPath}${fileName}`.replace(/^\//, '');

        dispatch(setDeleteFileName(fileFullName));
        dispatch(openModal({
            title: 'ARE YOU SURE YOU WANT TO DELETE FILE:',
            subTitle: fileFullName,
            modalType: ModalTypes.DeleteFileModal
        }));
    }

    const onDeleteDirectoryClick = (e: MouseEvent<SVGSVGElement>, directory: string) => {
        e.stopPropagation();

        dispatch(setDeleteFileName(directory));
        dispatch(setDeleteNode(node));
        dispatch(openModal({
            title: 'ARE YOU SURE YOU WANT TO DELETE DIRECTORY:',
            subTitle: directory,
            modalType: ModalTypes.DeleteDirectoryModal
        }));
    }

    return (
        <li className="tree-node-wrapper">
            <div className={`${isOpen  && !isEmptyDirectory ? 'open-list-item' : 'closed-list-item'} outer-list-item-wrapper`} onClick={() => setIsOpen(!isOpen)}>
                {isObject && !isEmptyDirectory && <span style={{ marginRight: 5 }}>
                    {isOpen ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} />}
                </span>}
                <span>{label}</span>
                 <div className="outer-list-operations">
                    <FontAwesomeIcon icon={faPlus} onClick={(e) => onAddElementClick(e, fullPath)} />
                    <FontAwesomeIcon icon={faFolderPlus} onClick={(e) => onAddDirectoryClick(e, fullPath)} />
                    <FontAwesomeIcon icon={faFolderMinus} onClick={(e) => onDeleteDirectoryClick(e, fullPath)} className="delete-operation-icon" />
                </div>
            </div>

            {isObject && isOpen && (
                <ul style={{ paddingLeft: 20 }}>
                    {Object.entries(node)
                        .filter(([key]) => key !== 'path' && key !== 'files' && key !== '.placeholder') // Ignore 'path', 'files', and '.placeholder'
                        .map(([key, value]) => (
                            <TreeNode
                                key={key}
                                node={value as IFileStructure}
                                label={key}
                                fullPath={(value as IFileStructure).path}
                            />
                        ))}

                    {node.files && node.files.length > 0 && (
                        <>
                            {node.files.map((fileName: string, index: number) => {
                                if (fileName === '.placeholder') return null; // Skip rendering placeholder files

                                const isSelectedFile = selectedFileName === `${fullPath}${fileName}`.replace(/^\//, '');
                                return (
                                    <li
                                        className={`${isSelectedFile ? 'selected-file' : ''} file-name-wrapper`}
                                        key={index}
                                        onDoubleClick={() => handleFileDoubleClick(fileName)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} onClick={(e) => onDeleteElementClick(e, fileName)} className="delete-operation-icon" />
                                        <span>{fileName}</span>
                                    </li>
                                )
                            })}
                        </>
                    )}
                </ul>
            )}
        </li>
    );
};

const TreeView: FC<ITreeViewProps> = ({ data }) => {
    return (
        <ul>
            <TreeNode node={data} label="Root" fullPath={data.path} />
        </ul>
    );
};

export default TreeView;