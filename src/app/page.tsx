import { Topbar } from "@/components/layout/Topbar";
import MyForm from "@/components/MyForm";

export default function Home() {
  return (
    <div className="m-4 p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">EDC JSON Config Generation</h1>
        <Topbar />
      </div>
      <main className="my-4">
        <MyForm />
      </main>
    </div>
  );
}
