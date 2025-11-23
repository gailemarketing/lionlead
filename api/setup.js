const { initializeDrive, getKnowledgeBase } = require('./googleService');
const { google } = require('googleapis');

module.exports = async (req, res) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!folderId || !serviceAccountKey) {
            return res.status(500).json({ error: 'Missing Environment Variables' });
        }

        const credentials = JSON.parse(serviceAccountKey);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
        const drive = google.drive({ version: 'v3', auth });

        // 1. Get Knowledge Base Content (Prompt_LionLead should be here)
        const knowledge = await getKnowledgeBase(folderId);

        // 2. List ALL files in Library to see Replit folder structure
        let libraryStructure = [];
        try {
            const folderRes = await drive.files.list({
                q: `'${folderId}' in parents and name = 'Library' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id)',
            });

            if (folderRes.data.files.length > 0) {
                const libraryId = folderRes.data.files[0].id;
                const filesRes = await drive.files.list({
                    q: `'${libraryId}' in parents and trashed = false`,
                    fields: 'files(id, name, mimeType)',
                });
                libraryStructure = filesRes.data.files;
            }
        } catch (e) {
            libraryStructure = [`Error listing files: ${e.message}`];
        }

        res.status(200).json({
            prompt_doc_content: knowledge,
            library_files: libraryStructure
        });

    } catch (error) {
        console.error("Inspector Error:", error);
        res.status(500).json({
            error: 'Inspection Failed',
            details: error.message
        });
    }
};
