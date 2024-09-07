import Button from "../../button/button.tsx";
import {closeModal} from "../../../redux/features/modal-slice.ts";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import {useDeleteDirectoryMutation} from "../../../redux/services/s3-api.ts";
import Loader from "../../loader/loader.tsx";
import ErrorText from "../../error-text/error-text.tsx";
import {clearFileContent} from "../../../redux/features/file-content-slice.ts";
import {collectAllFilesAndDirectories, isDeletePathContainedInFilePath} from "../../../utils/utils.ts";

const DeleteDirectoryModal = () => {
    const dispatch = useAppDispatch();
    const [deleteDirectory, { isLoading, isError }] = useDeleteDirectoryMutation();
    const { deleteFileName, deleteNode, selectedFileName } = useAppSelector((state) => state.fileContent);

    const onDeleteButtonClick = async () => {
        try {
            const isSelectedFileInDirectory = isDeletePathContainedInFilePath(deleteFileName, selectedFileName);
            if (isSelectedFileInDirectory) {
                dispatch(clearFileContent())
            }
            if (!deleteNode) {
                return
            }
            const fileKeysToDelete = collectAllFilesAndDirectories(deleteNode, deleteFileName);

            // Add the directory itself to the list of keys to delete
            fileKeysToDelete.push(deleteFileName.replace(/\/+$/, ''));

            await deleteDirectory(fileKeysToDelete).unwrap();
        } catch(err) {
            console.error('Error deleting directory!', err);
        }
        dispatch(closeModal());
    }

    const onCancelButtonClick = () => {
        dispatch(closeModal());
    }

    return(<div className="modal-content-wrapper">
        { isError && <ErrorText text="Error deleting directory!" />}
        <div className="delete-direcotry-disclaimer">Note that deleting the directory will delete all its files and sub-directories:</div>
        <div className={`${isLoading ? '' : 'delete-modal-buttons'}`}>
            {isLoading ?
                <Loader /> :
                <>
                    <Button onClick={onDeleteButtonClick} text="Delete" isPrimary />
                    <Button onClick={onCancelButtonClick} text="Cancel" />
                </>
            }
        </div>
    </div>)
}

export default DeleteDirectoryModal;