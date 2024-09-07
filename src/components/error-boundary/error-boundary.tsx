import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorLayout from "./error-layout/error-layout.tsx";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, errorMessage: null };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true, errorMessage: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({ errorMessage: error.message });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // If in development, display the actual error message else show generic message
            const isDevelopment = import.meta.env.VITE_MODE === 'development';
            const errorText = isDevelopment && this.state.errorMessage
                ? this.state.errorMessage
                : this.props.fallback;

            return <ErrorLayout errorText={errorText} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;