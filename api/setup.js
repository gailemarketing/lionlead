const { initializeDrive } = require('./googleService');

module.exports = async (req, res) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!folderId) {
            throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID');
        }
        if (!serviceAccountKey) {
            throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_KEY');
        }

        // Validate JSON parsing of the key
        try {
            JSON.parse(serviceAccountKey);
        } catch (e) {
            throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON. Please check for extra quotes or missing brackets.');
        }

        const result = await initializeDrive(folderId);

        if (!result.success) {
            return res.status(500).json(result);
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("Setup Endpoint Error:", error);
        res.status(500).json({
            error: 'Setup Failed',
            details: error.message,
            stack: error.stack
        });
    }
};
