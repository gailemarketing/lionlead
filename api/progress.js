const { saveUserProgress } = require('./googleService');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, userName, day, reflection } = req.body;

        if (!userId || !day) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const success = await saveUserProgress(userId, userName, day, reflection);

        if (success) {
            res.status(200).json({ message: 'Progress saved successfully' });
        } else {
            res.status(500).json({ error: 'Failed to save progress to Drive' });
        }

    } catch (error) {
        console.error("Progress API Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
