import {useState} from "react";
import InputField from "../../input-field/InputField.tsx";
import Button from "../../button/Button.tsx";
import {useUploadFileMutation} from "../../../redux/services/s3-api.ts";
import Loader from "../../loader/Loader.tsx";
import ErrorText from "../../error-text/error-text.tsx";
import {closeModal} from "../../../redux/features/modalSlice.ts";
import {useAppDispatch} from "../../../redux/store.ts";

const AddFileModal = () => {
    const dispatch = useAppDispatch();
    const [uploadFile, { isLoading, isError }] = useUploadFileMutation();
    const [fileName, setFileName] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');

    const onAddFileSubmitButtonClick = async () => {
        try {
            await uploadFile({ fileName, fileContent }).unwrap();
            dispatch(closeModal());
        } catch (err) {
            console.error('Error uploading file! => ', err);
        }
    }

    return(<div className="modal-content-wrapper">
        {isError && <ErrorText text="Error uploading the file. Please try again!"/>}
        <InputField value={fileName} label="File name" placeholder="File name..." onChange={setFileName} />
        <InputField value={fileContent} label="File content" placeholder="File content..." onChange={setFileContent} isTextArea />
        <div>
            {isLoading ? <Loader /> : <Button onClick={onAddFileSubmitButtonClick} text="Submit" />}
        </div>
    </div>)
}

export default AddFileModal;