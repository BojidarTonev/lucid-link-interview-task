import {useState} from "react";
import InputField from "../../input-field/InputField.tsx";
import Button from "../../button/Button.tsx";

const AddFileModal = () => {
    const [fileName, setFileName] = useState<string>('');

    const onAddFileSubmitButtonClick = () => {

    }

    return(<div className="modal-content-wrapper">
        <InputField value={fileName} label="File name" placeholder="File name..." onChange={setFileName} />
        <div>
            <Button onClick={onAddFileSubmitButtonClick} text="Submit" />
        </div>
    </div>)
}

export default AddFileModal;