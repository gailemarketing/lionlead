const { initializeDrive } = require('./googleService');

module.exports = async (req, res) => {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        return res.status(500).json({ error: 'Missing Environment Variables' });
    }

    const result = await initializeDrive(folderId);
    res.status(200).json(result);
};
