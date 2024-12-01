import React from "react";
import { PayoutStepResult } from "@/types";
import { extractFileName } from "@/lib/utils";

const PayoutStep: React.FC<{ steps: PayoutStepResult[] }> = ({ steps }) => {

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
                                    {
                                        step.status === "success" ? (
                                            <span className="ml-4 text-green-500">✅</span>
                                        ) : (
                                            <span className="ml-4 text-red-500">❌</span>
                                        )
                                    }
                                    <span className="ml-4 text-sm">{step.message}</span>
                                    {
                                        step.data && step.step === 'Upload Output Files' ? (
                                            <div className="ml-4 my-4 text-sm">
                                                {step.data.files && step.data.files.map((file: string, index: number) => (
                                                    <div key={index}>
                                                        <a href={file} target
                                                            ="_blank" className="text-blue-500">File: {extractFileName(file)}</a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null
                                    }
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