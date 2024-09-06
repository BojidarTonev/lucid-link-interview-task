import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorLayout from "./error-layout/error-layout.tsx";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return <ErrorLayout errorText={this.props.fallback} />
        }

        return this.props.children;
    }
}

export default ErrorBoundary;