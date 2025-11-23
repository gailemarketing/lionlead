const { getKnowledgeBase } = require('./googleService');

module.exports = async (req, res) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID' });
        }

        // Fetch Knowledge Base Content
        // This function reads all text/doc files in the 'Library' folder
        const knowledge = await getKnowledgeBase(folderId);

        res.status(200).json({
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
