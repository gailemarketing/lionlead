const { initializeDrive, getKnowledgeBase } = require('./googleService');
const { google } = require('googleapis');
const AdmZip = require('adm-zip');

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

        // 1. Find the ZIP file in Library
        let zipContent = {};
        try {
            const folderRes = await drive.files.list({
                q: `'${folderId}' in parents and name = 'Library' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id)',
            });

            if (folderRes.data.files.length > 0) {
                const libraryId = folderRes.data.files[0].id;
                const filesRes = await drive.files.list({
                    q: `'${libraryId}' in parents and name contains '.zip' and trashed = false`,
                    fields: 'files(id, name)',
                });

                if (filesRes.data.files.length > 0) {
                    const zipFileId = filesRes.data.files[0].id;

                    // Download ZIP
                    const response = await drive.files.get({
                        fileId: zipFileId,
                        alt: 'media',
                    }, { responseType: 'arraybuffer' });

                    const zip = new AdmZip(Buffer.from(response.data));
                    const zipEntries = zip.getEntries();

                    zipEntries.forEach(entry => {
                        if (!entry.isDirectory) {
                            // Capture HTML, CSS, JS files
                            if (entry.entryName.endsWith('.html') || entry.entryName.endsWith('.css') || entry.entryName.endsWith('.js')) {
                                zipContent[entry.entryName] = zip.readAsText(entry);
                            }
                        }
                    });
                }
            }
        } catch (e) {
            zipContent = { error: `ZIP Inspection Failed: ${e.message}` };
        }

        res.status(200).json({
            zip_content: zipContent
        });

    } catch (error) {
        console.error("Inspector Error:", error);
        res.status(500).json({
            error: 'Inspection Failed',
            details: error.message
        });
    }
};
