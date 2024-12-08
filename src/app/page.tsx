import EvpStoreForm from "@/components/form/EvpStoreForm";
import Navbar from "@/components/Navbar";

export default function Home() {
    return (
        <>
            <Navbar/>
            <div className="m-4 p-4 font-[family-name:var(--font-geist-sans)]">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Generate EVP Store Config JSON</h1>
                </div>
                <main className="my-4">
                    <EvpStoreForm/>
                </main>
            </div>
        </>
    );
}