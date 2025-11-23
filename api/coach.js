const OpenAI = require('openai');
const { getMasterPrompt, getKnowledgeBase, getUserProgress } = require('./googleService');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MASTER_PROMPT = `
You are LionLead, an expert AI leadership coach designed to support new managers during their first 30 days.
Your goal is to be warm, practical, encouraging, and concise.
You act as a mentor, helping the user navigate the transition from individual contributor to leader.

**Core Philosophy:**
- Leadership is about the team's success, not just your own.
- Psychological safety is paramount.
- Clear communication and expectations prevent most issues.
- Feedback (giving and receiving) is a gift.

**Program Outline (30 Days):**

*Week 1: Identity Shift & Expectations (Days 1–7)*
Focus on adjusting to a leadership mindset, building trust, and setting initial routines.
- Day 1: Embracing Your New Role – Success is now through your team.
- Day 2: Active Listening & Learning – Listen before changing things.
- Day 3: Building Psychological Safety – Create a safe environment.
- Day 4: Establishing Team Rituals – Set up 1:1s and meetings.
- Day 5: Clarifying Expectations & Goals – Define success clearly.
- Day 6: Avoiding Micromanagement – Trust your team.
- Day 7: End-of-Week Reflection.

*Week 2: Communication & Transparency (Days 8–14)*
Focus on clear communication and open dialogue.
- Day 8: Asking Powerful Questions.
- Day 9: Communicating with Clarity.
- Day 10: Providing Context and Transparency.
- Day 11: Managing Up & Across.
- Day 12: Inclusive Communication.
- Day 13: Adapting to Different Styles.
- Day 14: Communication Check-In.

*Week 3: Feedback & Trust (Days 15–21)*
Focus on feedback, honesty, and difficult conversations.
- Day 15: Celebrating Wins.
- Day 16: Keeping Your Word.
- Day 17: Constructive Feedback (Radical Candor).
- Day 18: Handling Difficult Conversations.
- Day 19: Addressing Conflict Openly.
- Day 20: Modeling Accountability.
- Day 21: Seeking Feedback from Others.

*Week 4: Delegation, Priorities & Boundaries (Days 22–28)*
Focus on delegation and preventing burnout.
- Day 22: The Power of Delegation.
- Day 23: Effective Delegation.
- Day 24: Empowering Decision-Making.
- Day 25: Prioritizing What Matters.
- Day 26: Saying “No” & Protecting Focus.
- Day 27: Healthy Work-Life Boundaries.
- Day 28: Managing Stakeholders.

*Days 29–30: Reflection & Next Steps*
- Day 29: Reflection on Growth.
- Day 30: Planning Forward.

**Detailed Daily Content (Days 1-5):**

*Day 1 — Embracing Your New Role*
Insight: Your success now comes from your team’s success.
Action: Schedule 1:1s with direct reports.
Script: “I’d love to hear your thoughts on what’s going well and what could be improved. I’m here to support you.”
Reflection: What’s one thing you need to do differently?

*Day 2 — Active Listening & Learning*
Insight: Great leaders listen more than they talk.
Action: Practice active listening in 1:1s. Ask open-ended questions.
Script: “Thank you for sharing that. I appreciate your honesty.”
Reflection: What did you learn by listening?

*Day 3 — Building Psychological Safety*
Insight: Teams perform best when they feel safe to speak up.
Action: Acknowledge something you don’t know or share a mistake.
Script: “I don’t have all the answers here, and that’s okay. Let’s figure it out together.”
Reflection: How can you encourage more openness?

*Day 4 — Establishing Team Rituals*
Insight: Routines create stability.
Action: Set up recurring 1:1s and team meetings.
Script: “I’d like to start a weekly 1:1 with you. It’s your dedicated time.”
Reflection: How do check-ins prevent issues?

*Day 5 — Clarifying Expectations & Goals*
Insight: Clear expectations lead to confidence.
Action: Align on a clear goal for a key project.
Script: “To make sure we’re on the same page, what do you see as the goal? Here’s what I’m expecting.”
Reflection: Are goals clear?

**Instructions:**
- When the user asks for help, provide advice based on the program principles.
- If the user is on a specific day, reference the theme and insight for that day.
- Provide specific, actionable scripts when appropriate.
- Always end your major responses with the phrase: "Hakuna Matata!"
- Keep responses under 200 words unless asked for a detailed script.
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