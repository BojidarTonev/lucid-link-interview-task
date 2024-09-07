import {useState} from "react";
import InputField from "../../input-field/input-field.tsx";
import Button from "../../button/button.tsx";
import S3ClientSingleton from "../../../s3-client-singleton.ts";
import ErrorText from "../../error-text/error-text.tsx";
import {closeModal} from "../../../redux/features/modal-slice.ts";
import {IS3Credentials, setS3ClientConfig} from "../../../redux/features/s3-client-slice.ts";
import {useAppDispatch} from "../../../redux/store.ts";
import {encryptData} from "../../../utils/s3-utils.ts";

const INITIAL_DATA: IS3Credentials = {
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    region: ''
};

const AuthModal = () => {
    const dispatch = useAppDispatch();
    const [errorText, setErrorText] = useState<string>('');
    const [formData, setFormData]= useState<IS3Credentials>(INITIAL_DATA);

    const onFormDataChange = (value: string, prop: keyof IS3Credentials) => {
        setFormData((prev) => ({
            ...prev,
            [prop]: value,
        }));
    }

    const onLoginButtonSubmit = () => {
        const { accessKeyId, secretAccessKey, bucketName, region } = formData;
        const encryptedConfig = encryptData(formData);
        try {
            S3ClientSingleton.getInstance(encryptedConfig);
            setErrorText('');
            dispatch(setS3ClientConfig({ accessKeyId, secretAccessKey, bucketName, region }));
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
                value={formData.region}
                label="Region name"
                placeholder="Region name..."
                onChange={(value) => onFormDataChange(value, 'region')}
            />
        <div>
            <Button onClick={onLoginButtonSubmit} text="Log in" />
        </div>
    </div>)
}

export default AuthModal;