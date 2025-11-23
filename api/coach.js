const OpenAI = require('openai');
const { getMasterPrompt, getKnowledgeBase, getUserProgress } = require('./googleService');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MASTER_PROMPT = `
You are LionLead, an AI leadership coach.
Your goal is to support new managers in their first 30 days.
Be warm, practical, and concise.
`;

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST method is allowed' });
    }

    try {
        const { message, userId, day, role, theme } = req.body;

        // 2. Fetch Dynamic Content from Drive
        let masterPrompt = DEFAULT_MASTER_PROMPT;
        let knowledgeContext = "";
        let userProgressContext = "";

        try {
            const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
            if (folderId) {
                const [promptText, knowledgeText, progressData] = await Promise.all([
                    getMasterPrompt(folderId),
                    getKnowledgeBase(folderId),
                    getUserProgress(folderId)
                ]);

                if (promptText) masterPrompt = promptText;
                if (knowledgeText) knowledgeContext = `\n\nReference Materials:\n${knowledgeText}`;

                // Filter progress for this user
                if (progressData && userId) {
                    const userRows = progressData.filter(row => row[0] === userId);
                    if (userRows.length > 0) {
                        userProgressContext = `\n\nUser History:\n${JSON.stringify(userRows)}`;
                    }
                }
            }
        } catch (driveError) {
            console.warn("Drive Fetch Error:", driveError);
            // Continue with defaults
        }

        // 3. Construct System Prompt
        const finalSystemPrompt = `${masterPrompt}\n${knowledgeContext}\n${userProgressContext}`;

        // 4. Call OpenAI
        let messages = [];
        let responseFormat = null;

        if (message) {
            // CHAT MODE
            messages = [
                { role: "system", content: finalSystemPrompt },
                { role: "user", content: message }
            ];
        } else {
            // DAILY CONTENT MODE (Legacy/Fallback)
            if (!day || !role || !theme) {
                return res.status(400).json({ error: 'Missing day, role, or theme for daily content generation.' });
            }
            messages = [
                { role: "system", content: finalSystemPrompt },
                { role: "user", content: `Generate content for Day ${day}, Role: ${role}, Theme: ${theme}. Return JSON.` }
            ];
            responseFormat = { type: "json_object" };
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            response_format: responseFormat,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;

        // 5. Return Response
        if (message) {
            res.status(200).json({ reply: aiResponse });
        } else {
            res.status(200).json(JSON.parse(aiResponse));
        }

    } catch (error) {
        console.error("Coach API Error:", error);
        res.status(500).json({ error: "Failed to generate coaching response", details: error.message });
    }
};