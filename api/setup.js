const { getKnowledgeBase, initializeDrive, testEditFile, testSheetWrite, debugListFiles } = require('./googleService');

module.exports = async (req, res) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID' });
        }

        // Initialize Drive (Create defaults & Debug Write Test)
        const initResult = await initializeDrive(folderId);

        // Test Edit Access
        const editResult = await testEditFile(folderId);

        // Test Sheet Write Access
        const sheetResult = await testSheetWrite(folderId);

        // Debug: List all files
        const visibleFiles = await debugListFiles(folderId);

        // Fetch Knowledge Base Content
        const knowledge = await getKnowledgeBase(folderId);

        res.status(200).json({
            init_result: initResult,
            edit_result: editResult,
            sheet_result: sheetResult,
            visible_files_in_folder: visibleFiles,
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
