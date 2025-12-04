const { getUserProgress } = require('./bigqueryService');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId parameter' });
        }

        const progress = await getUserProgress(userId);

        if (progress) {
            res.status(200).json({
                lastCompletedDay: progress.last_completed_day,
                history: progress.history
            });
        } else {
            // No progress found, return defaults
            res.status(200).json({
                lastCompletedDay: 0,
                history: []
            });
        }

    } catch (error) {
        console.error("Get Progress API Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
