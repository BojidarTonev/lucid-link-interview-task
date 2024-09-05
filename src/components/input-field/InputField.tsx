import React, { InputHTMLAttributes } from 'react';
import './InputField.css';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string, prop?: string) => void;
}

const InputField: React.FC<IInputProps> = ({ label, placeholder, value, onChange }) => {
    return (
        <div className="lucid-input-container">
            <label htmlFor={label} className="lucid-label">
                {label}
            </label>
            <input id={label} placeholder={placeholder} className="lucid-input" value={value} onChange={(e, prop = '') => onChange(e.target.value, prop)} />
        </div>
    );
};

export default InputField;