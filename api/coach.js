// Import Google Generative AI
// Install with: npm install @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Master prompt (system instructions)
const MASTER_PROMPT = `
Ты — LionLead, AI-компаньон для новоиспеченных менеджеров.
Твоя миссия: предоставлять ежедневную микро‑тренировку (один инсайт + одно действие) в течение первых 30 дней.
Твой тон: теплый, мотивирующий, практичный, краткий. Ты используешь метафору льва/прайда (команда, лидерство).
Крайне важно: общая длина контента (кроме заголовка) должна быть в пределах 110–130 слов.
Никогда не используй приветствия.

Вам переданы переменные:
{DAY_X}: Текущий день в цикле 30 дней (например, Day 5).
{USER_ROLE}: Роль пользователя (например, Engineering Lead).
{WEEK_THEME}: Тема недели (например, Identity Shift & Expectations).

Сгенерируй только один JSON объект с контентом дня. Строго следуй формату JSON. Не добавляй никаких комментариев вне JSON‑блока.

Формат вывода:
{
  "day_title": "Day {DAY_X} – {WEEK_THEME}",
  "insight": "Короткий, мотивирующий инсайт о лидерстве, адаптированный под {USER_ROLE}, макс. 2 предложения.",
  "micro_action": "Одно конкретное, реальное действие, которое пользователь должен выполнить сегодня. Фокусируйся на {USER_ROLE}.",
  "suggested_script": "Опциональный, но полезный пример фразы или скрипта (если применимо, иначе пусто).",
  "reflection_question": "Один вопрос для рефлексии (1 предложение)."
}
`;

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST method is allowed' });
    }

    const { day, role, theme } = req.body;
    if (!day || !role || !theme) {
        return res.status(400).json({ error: 'Missing day, role, or theme in request body' });
    }

    const finalPrompt = MASTER_PROMPT
        .replace('{DAY_X}', day)
        .replace('{USER_ROLE}', role)
        .replace('{WEEK_THEME}', theme);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const result = await model.generateContent([
            finalPrompt,
            `Сгенерируй контент для ${day} и роли ${role}.`
        ]);
        const text = result.response.text();
        const content = JSON.parse(text);
        res.status(200).json(content);
    } catch (error) {
        console.error("Google Gemini API Error:", error);
        res.status(500).json({ error: 'Failed to generate coaching content.', details: error.message });
    }
};