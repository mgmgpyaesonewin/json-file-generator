import { PayoutForm } from "@/components/form/PayoutForm";
import Navbar from "@/components/Navbar";

export default function CalculationEngine() {
    return (
        <>
            <Navbar/>
            <div className="m-4 p-4 font-[family-name:var(--font-geist-sans)]">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Generate Payout Files</h1>
                </div>
                <main className="my-4">
                   <PayoutForm />
                </main>
            </div>
        </>
    );
}