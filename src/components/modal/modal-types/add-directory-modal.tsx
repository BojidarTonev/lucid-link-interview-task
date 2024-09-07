import {useState} from "react";
import InputField from "../../input-field/input-field.tsx";
import Button from "../../button/button.tsx";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import {useUploadDirectoryMutation} from "../../../redux/services/s3-api.ts";
import {closeModal} from "../../../redux/features/modal-slice.ts";
import ErrorText from "../../error-text/error-text.tsx";
import Loader from "../../loader/loader.tsx";

const AddDirectoryModal = () => {
    const dispatch = useAppDispatch();
    const [directoryName, setDirectoryName] = useState<string>('');
    const [uploadDirectory, { isLoading, isError }] = useUploadDirectoryMutation();
    const { uploadFileDirectory } = useAppSelector((state) => state.fileContent);

    const onAddDirectorySubmitButtonClick = async () => {
        const fullDirectoryName = `${uploadFileDirectory}${directoryName}`.replace(/^\//, '');
        try {
            await uploadDirectory({ directoryName: fullDirectoryName }).unwrap();
            dispatch(closeModal());
        } catch (err) {
            console.error('Error uploading file! => ', err);
        }
    }

    return(<div className="modal-content-wrapper">
        {isError && <ErrorText text="Error uploading directory. Please try again!"/>}
        <InputField value={directoryName} label="Directory name" placeholder="Directory name..." onChange={setDirectoryName} />
        <div>
            {isLoading ? <Loader /> : <Button onClick={onAddDirectorySubmitButtonClick} text="Submit" />}
        </div>
    </div>)
}

export default AddDirectoryModal;