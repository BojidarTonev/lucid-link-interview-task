import {useState} from "react";
import InputField from "../../input-field/InputField.tsx";
import Button from "../../button/Button.tsx";

const AddDirectoryModal = () => {
    const [directoryName, setDirectoryName] = useState<string>('');

    const onAddDirectorySubmitButtonClick = () => {

    }

    return(<div className="modal-content-wrapper">
        <InputField value={directoryName} label="File name" placeholder="File name..." onChange={setDirectoryName} />
        <div>
            <Button onClick={onAddDirectorySubmitButtonClick} text="Submit" />
        </div>
    </div>)
}

export default AddDirectoryModal;