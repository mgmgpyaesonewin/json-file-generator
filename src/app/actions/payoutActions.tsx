'use server';

/**
 * Copy folder
 * @param {string} trxnDate
 * @returns {Promise}
 */
async function copyFolder(trxnDate: string) {
    try {
        const copyFolderResult = await fetch(`${process.env.NEXT_PAYOUT_API_URL}/copy-folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trxnDate: trxnDate }),
        });
        
        const data = await copyFolderResult.json();

        return {
            status: "success",
            step: "Copy Folder",
            message: "Folder copied successfully",
            data
        }
    } catch (error) {
        return {
            status: "error",
            step: "Copy Folder",
            message: "Error copying folder",
            data: error
        }
    }
}

/**
 * Download files
 * @param {string} trxnDate
 * @returns {Promise}
 */
async function downloadFiles(trxnDate: string) {
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
        return {
            status: "error",
            step: "Download Files",
            message: "Error downloading files",
            data: error
        }
    }
}

/**
 * Execute db scripts
 * @param {string} trxnDate
 * @returns {Promise}
 */
async function executeDbScripts(trxnDate: string) {
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
        return {
            status: "error",
            step: "Execute DB Scripts",
            message: "Error executing DB scripts",
            data: error
        }
    }
}

/**
 * Upload output files
 * @param {string} trxnDate
 * @returns {Promise}
 */
async function uploadOutputFiles(trxnDate: string) {
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
        return {
            status: "error",
            step: "Upload Output Files",
            message: "Error uploading files",
            data: error
        }
    }
}


export { 
    copyFolder,
    downloadFiles,
    executeDbScripts,
    uploadOutputFiles
};