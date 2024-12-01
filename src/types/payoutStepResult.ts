export interface PayoutStepResult {
    status: "success" | "error";
    step: string;
    message: string;
    data?: never | null;
    error?: string;
}