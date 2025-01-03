import React from "react";
import { Button } from "@/components/ui/button";
import { PayoutStepResult } from "@/types";
import { extractFileName } from "@/lib/utils";
import { downloadUrlsAsZip } from "@/app/actions/payoutActions";
import { EmailMerchantsForm } from "./form/email-merchants-form";

const PayoutStep: React.FC<{ steps: PayoutStepResult[], fileName: Date }> = ({ steps, fileName }) => {
  const handleDownload = async (urls: string[], fileName: string) => {
    try {
      const zipFile = await downloadUrlsAsZip(urls);
      // Convert the Uint8Array into a Blob
      const blob = new Blob([zipFile], { type: "application/zip" });

      // Create an object URL from the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.zip`;
      document.body.appendChild(link); // Append to body for Firefox compatibility
      link.click();
      document.body.removeChild(link); // Cleanup the temporary anchor

      // Revoke the object URL to free memory
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading zip:", error);
    }
  };

  const getFileName = (fileName: Date) => {
    return fileName.toISOString().split("T")[0];
  }

  const StepFiles: React.FC<{ files: string[], fileName: string }> = ({ files, fileName }) => (
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
        <div className="flex items-center">
          <Button onClick={() => handleDownload(files, fileName)} className="mt-4">
            Download All
          </Button>
          <div className="ml-4 mt-4">
            <EmailMerchantsForm files={files} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {steps.map((step: PayoutStepResult, index: number) => (
        <React.Fragment key={step.step}>
          <div className="flex">
            <div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
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
                  <StepFiles files={step.data.files} fileName={getFileName(fileName)} />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PayoutStep;
