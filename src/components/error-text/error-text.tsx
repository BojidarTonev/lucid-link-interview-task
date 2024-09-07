import {FC} from "react";
import './error-text.css';

interface IErrorTextProps {
    text: string;
    hasBackground?: boolean;
}

// we can abstract this component to accept object type of the provided error
// from which it can derive the actual message and have a fallback text if the error
// is not in the correct format, but in order to have such functionality we would need
// typification on the error which is usually related to specific BE and that is something
// we do not have for the purpose of this task, so I have left it like that for simplicity
const ErrorText: FC<IErrorTextProps> = ({text, hasBackground = false}) => {
    return(<div className={`error-text ${hasBackground ? 'error-with-background' : ''}`}>{text}</div>)
}

export default ErrorText;