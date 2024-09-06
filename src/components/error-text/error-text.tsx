import {FC} from "react";
import './error-text.css';

interface IErrorTextProps {
    text: string;
    hasBackground?: boolean;
}

const ErrorText: FC<IErrorTextProps> = ({text, hasBackground = false}) => {
    return(<div className={`error-text ${hasBackground ? 'error-with-background' : ''}`}>{text}</div>)
}

export default ErrorText;