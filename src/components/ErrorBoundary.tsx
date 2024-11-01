import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: false }> {
    constructor(props: { children: React.ReactNode }) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }

    // lets you update state in response to an error and display an error message to the user
    static getDerivedStateFromError(error: any) {
        return { hasError: true }
    }
    componentDidCatch(error: any, errorInfo: any) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }
    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>Oops, there is an error!</h2>
                </div>
            )
        }

        // Return children components in case of no error
        return this.props.children
    }
}

export default ErrorBoundary