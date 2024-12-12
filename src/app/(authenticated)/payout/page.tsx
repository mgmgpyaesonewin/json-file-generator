import { PayoutForm } from "@/components/form/PayoutForm";

export default function CalculationEngine() {
    console.log("Environment: ", process.env.NEXT_PUBLIC_BASE_URL);
    console.log("Environment: ", process.env.NEXT_PAYOUT_API_URL);
    return (
        <>
            <PayoutForm />
        </>
    );
}