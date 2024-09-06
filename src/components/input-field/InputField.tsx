import {FC} from 'react';
import './InputField.css';

interface IInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string, prop?: string) => void;
    isTextArea?: boolean;
}

const InputField: FC<IInputProps> = ({ label, placeholder, value, onChange, isTextArea = false }) => {
    return (
        <div className="lucid-input-container">
            <label htmlFor={label} className="lucid-label">
                {label}
            </label>
            {isTextArea ?
                <textarea
                    id={label}
                    placeholder={placeholder}
                    className="lucid-input"
                    value={value}
                    onChange={(e, prop = '') => onChange(e.target.value, prop)}
                /> :
                <input
                    id={label}
                    placeholder={placeholder}
                    className="lucid-input"
                    value={value}
                    onChange={(e, prop = '') => onChange(e.target.value, prop)}
                />
            }
        </div>
    );
};

export default InputField;