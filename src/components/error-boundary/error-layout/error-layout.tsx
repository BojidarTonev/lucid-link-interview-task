import {FC} from 'react';
import LucidLinkLogo from '/lucidlink-logo.png';
import ErrorText from "../../error-text/error-text.tsx";
import Button from "../../button/button.tsx";
import S3ClientSingleton from "../../../s3-client-singleton.ts";
import {clearFileContent} from "../../../redux/features/file-content-slice.ts";
import {clearS3ClientConfig} from "../../../redux/features/s3-client-slice.ts";
import {useAppDispatch} from "../../../redux/store.ts";
import './error-layout.css';

interface IErrorLayoutProps {
    errorText: string
}

const ErrorLayout: FC<IErrorLayoutProps> = ({errorText}) => {
    const dispatch = useAppDispatch();

    const onReloadPageClick = () => {
        S3ClientSingleton.clearInstance();
        dispatch(clearFileContent());
        dispatch(clearS3ClientConfig());
        location.reload();
    }

    return(<div className="error-layout">
        <ErrorText text={errorText} hasBackground />
        <Button onClick={onReloadPageClick} text="Reload page" />
        <img src={LucidLinkLogo} className="error-logo" alt="lucid-link-logo" />
    </div>)
}

export default ErrorLayout;