const { getKnowledgeBase, initializeDrive } = require('./googleService');

module.exports = async (req, res) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID' });
        }

        // Initialize Drive (Create defaults & Debug Write Test)
        const initResult = await initializeDrive(folderId);

        // Fetch Knowledge Base Content
        const knowledge = await getKnowledgeBase(folderId);

        res.status(200).json({
            init_result: initResult,
            knowledge_content: knowledge
        });

    } catch (error) {
        console.error("Setup Error:", error);
        res.status(500).json({
            error: 'Setup Failed',
            details: error.message
        });
    }
};
