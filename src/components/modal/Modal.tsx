import {ReactNode, useCallback} from 'react';
import {closeModal, ModalTypes} from "../../redux/features/modalSlice.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import AuthModal from "./modal-types/auth-modal.tsx";
import AddDirectoryModal from "./modal-types/add-directory-modal.tsx";
import AddFileModal from "./modal-types/add-file-modal.tsx";
import DeleteFileModal from "./modal-types/delete-file-modal.tsx";
import './Modal.css';
import {useAppDispatch, useAppSelector} from "../../redux/store.ts";

const Modal = (): ReactNode | null => {
    const dispatch = useAppDispatch();
    const { isOpen, title, subTitle, modalType } = useAppSelector((state) => state.modal);

    const modalContent = useCallback(() => {
        switch (modalType) {
            case ModalTypes.AuthModal:
                return <AuthModal />
            case ModalTypes.AddDirectoryModal:
                return <AddDirectoryModal />;
            case ModalTypes.AddFileModal:
                return <AddFileModal />;
            case ModalTypes.DeleteFileModal:
                return <DeleteFileModal />
            default:
                return <div/>;
        }
    }, [modalType])

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`modal-overlay ${isOpen ? 'fade-in' : 'fade-out'}`}>
            <div className="modal-content">
                <FontAwesomeIcon icon={faXmark} onClick={() => dispatch(closeModal())} className="close-modal-icon" />
                <div className="modal-title">
                    {title}
                    {subTitle && <div>{subTitle}</div>}
                </div>
                {modalContent()}
            </div>
        </div>
    );
}

export default Modal;