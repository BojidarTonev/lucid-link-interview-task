import {useState} from "react";
import {useDispatch} from "react-redux";
import InputField from "../../input-field/InputField.tsx";
import Button from "../../button/Button.tsx";
import S3ClientSingleton from "../../../s3-client-singleton.ts";
import ErrorText from "../../error-text/error-text.tsx";
import {closeModal} from "../../../redux/features/modalSlice.ts";
import {setS3ClientConfig} from "../../../redux/features/s3ClientSlice.ts";

interface IAuthFormData {
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    regionName: string;
}

const INITIAL_DATA: IAuthFormData = {
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    regionName: ''
};

const AuthModal = () => {
    const dispatch = useDispatch();
    const [errorText, setErrorText] = useState<string>('');
    const [formData, setFormData]= useState<IAuthFormData>(INITIAL_DATA);

    const onFormDataChange = (value: string, prop: keyof IAuthFormData) => {
        setFormData((prev) => ({
            ...prev,
            [prop]: value,
        }));
    }

    const onLoginButtonSubmit = () => {
        const { accessKeyId, secretAccessKey, bucketName, regionName } = formData;
        try {
            S3ClientSingleton.getInstance({ accessKeyId, secretAccessKey, region: regionName, bucketName });
            setErrorText('');
            dispatch(setS3ClientConfig({ accessKeyId, secretAccessKey, bucketName, region: regionName }));
            dispatch(closeModal());
            console.log('Login successful!');
        } catch {
            setErrorText('Login failed! Check your credentials');
            console.error('Login failed!');
        }
        setFormData(INITIAL_DATA);
    }

    return(<div className="modal-content-wrapper">
        {errorText && <ErrorText text={errorText}/>}
            <InputField
                value={formData.accessKeyId}
                label="Access Key Id"
                placeholder="Access Key Id..."
                onChange={(value) => onFormDataChange(value, 'accessKeyId')}
            />
            <InputField
                value={formData.secretAccessKey}
                label="Secret Access Key"
                placeholder="Secret Access Key..."
                onChange={(value) => onFormDataChange(value, 'secretAccessKey')}
            />
            <InputField
                value={formData.bucketName}
                label="Bucket name"
                placeholder="Bucket name..."
                onChange={(value) => onFormDataChange(value, 'bucketName')}
            />
            <InputField
                value={formData.regionName}
                label="Region name"
                placeholder="Region name..."
                onChange={(value) => onFormDataChange(value, 'regionName')}
            />
        <div>
            <Button onClick={onLoginButtonSubmit} text="Log in" />
        </div>
    </div>)
}

export default AuthModal;