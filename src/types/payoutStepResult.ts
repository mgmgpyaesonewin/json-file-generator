export interface PayoutStepResult {
    status: "success" | "error";
    step: string;
    message: string;
    data?: {
        message?: string;
        files?: string[];
    };
    error?: string;
}