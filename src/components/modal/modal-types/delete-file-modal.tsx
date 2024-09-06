import Button from "../../button/Button.tsx";
import {useDispatch} from "react-redux";
import {closeModal} from "../../../redux/features/modalSlice.ts";

const DeleteFileModal = () => {
    const dispatch = useDispatch();

    const onDeleteButtonClick = () => {
        dispatch(closeModal());
    }

    const onCancelButtonClick = () => {
        dispatch(closeModal());
    }

    return(<div className="modal-content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '60%'}}>
            <Button onClick={onDeleteButtonClick} text="Delete" isPrimary />
            <Button onClick={onCancelButtonClick} text="Cancel" />
        </div>
    </div>)
}

export default DeleteFileModal;