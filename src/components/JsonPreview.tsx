import { HiClipboard, HiCloudDownload } from "react-icons/hi";
import React, { useState } from 'react';

interface JsonPreviewProps {
    data: never | null;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
    const [copied, setCopied] = useState(false);

    // Copy JSON to clipboard
    const handleCopy = () => {
        if (data) {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }
    };

    // Download JSON as file
    const handleDownload = () => {
        if (data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'config.json';
            link.click();
        }
    };

    return (
        <div className="relative flex flex-col w-1/2 max-h-screen">
            <div className="flex justify-end space-x-2 mb-2">
                <button
                    onClick={handleDownload}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 rounded">
                    <HiCloudDownload className="h-5 w-5 text-gray-700" />
                    <span className="ml-1 text-sm">Download</span>
                </button>
                <button
                    onClick={handleCopy}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 rounded">
                    <HiClipboard className="h-5 w-5 text-gray-700" />
                    <span className="ml-1 text-sm">Copy</span>
                </button>

            </div>
            <pre className="flex-1 bg-gray-100 p-4 rounded overflow-scroll">
                {data && JSON.stringify(data, null, 2)}
            </pre>
            {copied && <div className="absolute top-0 right-0 p-2 bg-green-200 text-green-800 rounded">Copied!</div>}
        </div>
    );
};

export default JsonPreview;
