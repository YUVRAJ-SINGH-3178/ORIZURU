import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", color: "white", backgroundColor: "#0f0b08", minHeight: "100vh", fontFamily: "sans-serif" }}>
                    <h1 style={{ color: "#EF4444" }}>Something went wrong.</h1>
                    <p>We're sorry, an unexpected error occurred. Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#f97316", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
