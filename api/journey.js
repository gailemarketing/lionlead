const { getJourneyData } = require('./googleService');

module.exports = async (req, res) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID' });
        }

        const journeyData = await getJourneyData(folderId);

        // Cache for 1 hour to avoid hitting Drive limits
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).json(journeyData);

    } catch (error) {
        console.error("Journey API Error:", error);
        res.status(500).json({ error: 'Failed to fetch journey data' });
    }
};
