import {FC} from "react";
import './error-text.css';

interface IErrorTextProps {
    text: string
}

const ErrorText: FC<IErrorTextProps> = ({text}) => {
    return(<div className="error-text">{text}</div>)
}

export default ErrorText;