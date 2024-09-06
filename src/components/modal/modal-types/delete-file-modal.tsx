import Button from "../../button/button.tsx";
import {closeModal} from "../../../redux/features/modal-slice.ts";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import {useDeleteFileMutation} from "../../../redux/services/s3-api.ts";
import Loader from "../../loader/loader.tsx";
import ErrorText from "../../error-text/error-text.tsx";
import {clearFileContent} from "../../../redux/features/file-content-slice.ts";

const DeleteFileModal = () => {
    const dispatch = useAppDispatch();
    const [deleteFile, { isLoading, isError }] = useDeleteFileMutation();
    const { deleteFileName, selectedFileName } = useAppSelector((state) => state.fileContent);

    const onDeleteButtonClick = async () => {
        try {
            const isDeleteFileSelected = deleteFileName === selectedFileName;
            if (isDeleteFileSelected) {
                dispatch(clearFileContent())
            }
            await deleteFile({ fileName: deleteFileName }).unwrap();
        } catch(err) {
            console.error('Error deleting file!', err);
        }
        dispatch(closeModal());
    }

    const onCancelButtonClick = () => {
        dispatch(closeModal());
    }

    return(<div className="modal-content-wrapper">
        { isError && <ErrorText text="Error deleting item!" />}
        <div className={`${isLoading ? '' : 'delete-modal-buttons'}`}>
            { isLoading ?
                <Loader /> :
                <>
                    <Button onClick={onDeleteButtonClick} text="Delete" isPrimary />
                    <Button onClick={onCancelButtonClick} text="Cancel" />
                </>
            }
        </div>
    </div>)
}

export default DeleteFileModal;