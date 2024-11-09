import Navbar from "@/components/Navbar";
import TtbConfigForm from "@/components/form/TtbConfigForm";

export default function TtbConfig() {
    return (
        <>
            <Navbar/>
            <div className="m-4 p-4 font-[family-name:var(--font-geist-sans)]">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Generate TTB Config JSON</h1>
                </div>
                <main className="my-4">
                    <TtbConfigForm />
                </main>
            </div>
        </>
    );
}