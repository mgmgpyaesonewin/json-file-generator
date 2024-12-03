import React from "react";
import { Button } from '@/components/ui/button';
import { PayoutStepResult } from "@/types";
import { extractFileName } from "@/lib/utils";
import { downloadUrlsAsZip } from "@/app/actions/payoutActions";

const PayoutStep: React.FC<{ steps: PayoutStepResult[] }> = ({ steps }) => {
    const handleDownload = async (urls: string[]) => {
        try {
            const zipFile = await downloadUrlsAsZip(urls);
            // Convert the Uint8Array into a Blob
            const blob = new Blob([zipFile], { type: "application/zip" });

            // Create an object URL from the Blob
            const url = URL.createObjectURL(blob);

            // Create a temporary anchor element and trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.download = "files.zip";
            document.body.appendChild(link); // Append to body for Firefox compatibility
            link.click();
            document.body.removeChild(link); // Cleanup the temporary anchor

            // Revoke the object URL to free memory
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading zip:", error);
        }
    };

    const StepFiles: React.FC<{ files: string[] }> = ({ files }) => (
        <div className="ml-4 my-4 text-sm">
            {files.map((file, index) => (
                <div key={index}>
                    <a 
                        href={file} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500"
                    >
                        File: {extractFileName(file)}
                    </a>
                </div>
            ))}
            {files.length > 1 && (
                <Button onClick={() => handleDownload(files)} className="mt-4">
                    Download All
                </Button>
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-4 gap-4 text-base text-gray-600">
            {
                steps.map((step: PayoutStepResult, index: number) => (
                    <React.Fragment key={step.step}>
                        <div className="flex">
                            <div>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl">
                                        {index + 1}
                                    </div>
                                    <span className="ml-4 font-medium">Step: {step.step}</span>
                                </div>
                                <div className="mt-8">
                                    {step.status === "success" ? (
                                        <span className="ml-4 text-green-500">✅</span>
                                    ) : (
                                        <span className="ml-4 text-red-500">❌</span>
                                    )}
                                    <span className="ml-4 text-sm">{step.message}</span>
                                    {step.data?.files && step.step === "Upload Output Files" && (
                                        <StepFiles files={step.data.files} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))
            }
        </div>
    );
};

export default PayoutStep;
