import {FC} from 'react';
import LucidLinkLogo from '/lucidlink-logo.png';
import ErrorText from "../../error-text/error-text.tsx";
import Button from "../../button/button.tsx";
import './error-layout.css';

interface IErrorLayoutProps {
    errorText: string
}

const ErrorLayout: FC<IErrorLayoutProps> = ({errorText}) => {
    return(<div className="error-layout">
        <ErrorText text={errorText} hasBackground />
        <Button onClick={() => location.reload()} text="Reload page" isPrimary />
        <img src={LucidLinkLogo} className="error-logo" alt="lucid-link-logo" />
    </div>)
}

export default ErrorLayout;