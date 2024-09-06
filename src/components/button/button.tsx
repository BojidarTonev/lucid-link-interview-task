import './button.css';

interface IButtonProps {
    onClick: () => Promise<void> | void,
    text: string,
    isPrimary?: boolean
    className?: string
}

const Button = (props: IButtonProps) => {
    const {onClick, text, isPrimary = false, className = ''} = props;

    const buttonClass = `lucid-link-button ${isPrimary ? 'lucid-primary' : ''} ${className}`;

    return(<button
        className={buttonClass}
        onClick={onClick}
    >
        {text}
    </button>)
}

export default Button;