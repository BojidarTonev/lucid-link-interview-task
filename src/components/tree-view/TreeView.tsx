import {FC, MouseEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setSelectedFileName} from "../../redux/features/fileContentSlice.ts";
import {useLazyGetFileContentQuery} from "../../redux/services/s3-api.ts";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleRight, faFolderPlus, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {ModalTypes, openModal} from "../../redux/features/modalSlice.ts";
import './TreeView.css';

interface ITreeViewProps {
    data: any
}

interface ITReeNodeProps {
    node: any,
    label: string,
    fullPath: string
}

const TreeNode: FC<ITReeNodeProps> = ({ node, label, fullPath }) => {
    const dispatch = useDispatch();
    const [trigger] = useLazyGetFileContentQuery();
    const { selectedFileName } = useSelector((state: RootState) => state.fileContent);
    const [isOpen, setIsOpen] = useState(false);

    const isObject = node && typeof node === "object" && !Array.isArray(node);

    const handleFileDoubleClick = (fileName: string) => {
        if (!fileName) {
            return;
        }
        const fullFilePath = `${fullPath}${fileName}`.replace(/^\//, '');
        trigger(fullFilePath);
        dispatch(setSelectedFileName(fullFilePath));
    };

    const onAddElementClick = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();

        dispatch(openModal({title: 'ADD FILE TO:', subTitle: fullPath, modalType: ModalTypes.AddFileModal}));
    }

    const onAddDirectoryClick = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();

        dispatch(openModal({title: 'ADD DIRECTORY TO:', subTitle: fullPath, modalType: ModalTypes.AddDirectoryModal}));
    }

    const onDeleteElementClick = (e: MouseEvent<SVGSVGElement>, fileName: string) => {
        e.stopPropagation();

        dispatch(openModal({
            title: 'ARE YOU SURE YOU WANT TO DELETE FILE:',
            subTitle: `${fullPath}${fileName}`.replace(/^\//, ''),
            modalType: ModalTypes.DeleteFileModal}
        ));
    }

    return (
        <li className="tree-node-wrapper">
            <div className={`${isOpen ? 'open-list-item' : 'closed-list-item'} outer-list-item-wrapper`} onClick={() => setIsOpen(!isOpen)}>
                {isObject && <span style={{ marginRight: 5 }}>
                    {isOpen ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight}/>}
                </span>}
                <span>{label}</span>
                <div className="outer-list-operations">
                    <FontAwesomeIcon icon={faPlus} onClick={onAddElementClick} />
                    <FontAwesomeIcon icon={faFolderPlus} onClick={onAddDirectoryClick} />
                </div>
            </div>

            {isObject && isOpen && (
                <ul style={{ paddingLeft: 20 }}>
                    {Object.entries(node)
                        .filter(([key]) => key !== 'path' && key !== 'files') // Ignore 'path' and 'files'
                        .map(([key, value]) => (
                            <TreeNode
                                key={key}
                                node={value}
                                label={key}
                                fullPath={value.path}
                            />
                        ))}

                    {node.files && node.files.length > 0 && (
                        <ul>
                            {node.files.map((fileName: string, index: number) => {
                                const isSelectedFile = selectedFileName === `${fullPath}${fileName}`.replace(/^\//, '');
                                return (
                                    <li
                                        className={`${isSelectedFile ? 'selected-file' : ''} file-name-wrapper`}
                                        key={index}
                                        onDoubleClick={() => handleFileDoubleClick(fileName)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} onClick={(e) => onDeleteElementClick(e, fileName)} />
                                        <span>{fileName}</span>
                                    </li>
                                )
                            })}
                        </ul>
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