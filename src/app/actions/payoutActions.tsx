'use server';

import { extractFileName } from "@/lib/utils";
import { PayoutStepResult } from "@/types";
import JSZip from 'jszip';

/**
 * Copy folder
 */
async function copyFolder(trxnDate: string): Promise<PayoutStepResult> {
    try {
        const copyFolderResult = await fetch(`${process.env.NEXT_PAYOUT_API_URL}/copy-folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trxnDate }),
        });
        
        const data = await copyFolderResult.json();

        return {
            status: "success",
            step: "Copy Folder",
            message: "Folder copied successfully",
            data
        }
    } catch (error) {
        console.error("Error copying folder:", error);
        return {
            status: "error",
            step: "Copy Folder",
            message: "Error copying folder",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

/**
 * Download files
 */
async function downloadFiles(trxnDate: string): Promise<PayoutStepResult> {
    try {
        const downloadFilesResult = await fetch(`${process.env.NEXT_PAYOUT_API_URL}/download-files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trxnDate: trxnDate }),
        });

        const data = await downloadFilesResult.json();

        return {
            status: "success",
            step: "Download Files",
            message: "Files downloaded successfully",
            data
        }
    } catch (error) {
        console.error("Error downloading files:", error);
        return {
            status: "error",
            step: "Download Files",
            message: "Error downloading files",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

/**
 * Execute db scripts
 */
async function executeDbScripts(trxnDate: string): Promise<PayoutStepResult> {
    try {
        const executeDbScriptsResult = await fetch(`${process.env.NEXT_PAYOUT_API_URL}/execute-db`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trxnDate: trxnDate }),
        });

        const data = await executeDbScriptsResult.json();
    
        return {
            status: "success",
            step: "Execute DB Scripts",
            message: "DB scripts executed successfully",
            data
        }
    } catch (error) {
        console.error("Error executing DB scripts:", error);
        return {
            status: "error",
            step: "Execute DB Scripts",
            message: "Error executing DB scripts",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

/**
 * Upload output files
 * @param {string} trxnDate
 * @returns {Promise}
 */
async function uploadOutputFiles(trxnDate: string): Promise<PayoutStepResult> {
    try {
        const uploadOutputFilesResult = await fetch(`${process.env.NEXT_PAYOUT_API_URL}/upload-output-files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trxnDate: trxnDate }),
        });

        const data = await uploadOutputFilesResult.json();
    
        return {
            status: "success",
            step: "Upload Output Files",
            message: "Files uploaded successfully",
            data
        }
    } catch (error) {
        console.error("Error uploading files:", error);
        return {
            status: "error",
            step: "Upload Output Files",
            message: "Error uploading files",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

/**
 * Download AWS signed urls as zip
 */
async function downloadUrlsAsZip(urls: string[]): Promise<Buffer> {
    const zip = new JSZip();

    await Promise.all(urls.map(async (url, index) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);

            const arrayBuffer = await response.arrayBuffer();
            const fileName = extractFileName(url) || `file-${index + 1}`;
            zip.file(fileName, arrayBuffer);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    }));

    const zipFile = await zip.generateAsync({ type: 'nodebuffer' });
    return zipFile;
}


export { 
    copyFolder,
    downloadFiles,
    executeDbScripts,
    uploadOutputFiles,
    downloadUrlsAsZip
};