const { google } = require('googleapis');

// Initialize Auth
const getAuthClient = () => {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    return new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
};

// 1. Fetch Master Prompt from Drive
async function getMasterPrompt(folderId) {
    try {
        const auth = getAuthClient();
        const drive = google.drive({ version: 'v3', auth });

        // Search for 'master_prompt.txt' in the specific folder
        const res = await drive.files.list({
            q: `'${folderId}' in parents and name = 'master_prompt.txt' and trashed = false`,
            fields: 'files(id, name)',
        });

        if (res.data.files.length > 0) {
            const fileId = res.data.files[0].id;
            const fileContent = await drive.files.get({
                fileId: fileId,
                alt: 'media',
            });
            return fileContent.data;
        }
    } catch (error) {
        console.error('Error fetching master prompt:', error.message);
    }
    return null; // Fallback will be handled in coach.js
}

// 2. Fetch Knowledge Base (Text files from 'Library' folder)
async function getKnowledgeBase(folderId) {
    let knowledgeText = "";
    try {
        const auth = getAuthClient();
        const drive = google.drive({ version: 'v3', auth });

        // Find 'Library' folder inside the main folder
        const folderRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'Library' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: 'files(id)',
        });

        if (folderRes.data.files.length > 0) {
            const libraryId = folderRes.data.files[0].id;

            // List text/doc files in Library
            const filesRes = await drive.files.list({
                q: `'${libraryId}' in parents and (mimeType = 'text/plain' or mimeType = 'application/vnd.google-apps.document') and trashed = false`,
                fields: 'files(id, name, mimeType)',
            });

            for (const file of filesRes.data.files) {
                try {
                    let content;
                    if (file.mimeType === 'application/vnd.google-apps.document') {
                        // Export Google Doc as text
                        content = await drive.files.export({
                            fileId: file.id,
                            mimeType: 'text/plain',
                        });
                    } else {
                        // Download plain text file
                        content = await drive.files.get({
                            fileId: file.id,
                            alt: 'media',
                        });
                    }
                    knowledgeText += `\n--- Source: ${file.name} ---\n${content.data}\n`;
                } catch (e) {
                    console.error(`Failed to read file ${file.name}:`, e.message);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching knowledge base:', error.message);
    }
    return knowledgeText;
}

// 3. Fetch User Progress from 'Progress' Sheet
async function getUserProgress(folderId, userId) {
    try {
        const auth = getAuthClient();
        const drive = google.drive({ version: 'v3', auth });
        const sheets = google.sheets({ version: 'v4', auth });

        // Find 'Progress' sheet
        const fileRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'Progress' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
            fields: 'files(id)',
        });

        if (fileRes.data.files.length > 0) {
            const spreadsheetId = fileRes.data.files[0].id;

            // Read all data from the first sheet
            const sheetData = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'A:Z', // Read whole sheet
            });

            const rows = sheetData.data.values;
            if (!rows || rows.length === 0) return null;

            // Simple search for userId in the first column (assuming A=UserId)
            // Header row is 0, data starts at 1
            const userRow = rows.find(row => row[0] === userId);

            if (userRow) {
                // Return the whole row as context string
                return `User Progress: ${userRow.join(', ')}`;
            }
        }
    } catch (error) {
        console.error('Error fetching user progress:', error.message);
    }
    return null;
}

module.exports = {
    getMasterPrompt,
    getKnowledgeBase,
    getUserProgress
};
