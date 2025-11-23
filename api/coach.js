// Импорт OpenAI
// Установите библиотеку OpenAI: npm install openai
const OpenAI = require('openai');
const { getMasterPrompt, getKnowledgeBase, getUserProgress } = require('./googleService');

// Инициализируем OpenAI API. Ключ будет взят из переменных окружения Vercel
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Default Master Prompt (fallback)
const DEFAULT_MASTER_PROMPT = `
Ты — LionLead, AI-компаньон для новоиспеченных менеджеров.
Твоя миссия: предоставлять ежедневную микро-тренировку (один инсайт + одно действие) в течение первых 30 дней.
Твой тон: теплый, мотивирующий, практичный, краткий. Ты используешь метафору льва/прайда (команда, лидерство).
Крайне важно: общая длина контента (кроме заголовка) должна быть в пределах 110–130 слов.
Никогда не используй приветствия.

Вам переданы переменные:
{DAY_X}: Текущий день в цикле 30 дней (например, Day 5).
{USER_ROLE}: Роль пользователя (например, Engineering Lead).
{WEEK_THEME}: Тема недели (например, Identity Shift & Expectations).

Сгенерируй только один JSON объект с контентом дня. Строго следуй этому формату JSON. Не добавляй никаких других комментариев, текста или пояснений вне этого JSON-блока.

Формат вывода:
{
  "day_title": "Day {DAY_X} – {WEEK_THEME}",
  "insight": "Короткий, мотивирующий инсайт о лидерстве, адаптированный под {USER_ROLE}, макс. 2 предложения.",
  "micro_action": "Одно конкретное, реальное действие, которое пользователь должен выполнить сегодня. Фокусируйся на {USER_ROLE}.",
  "suggested_script": "Опциональный, но полезный пример фразы или скрипта для применения micro_action (если применимо, иначе оставь пустым).",
  "reflection_question": "Один вопрос для рефлексии (1 предложение)."
}
`;

// Функция-обработчик (Lambda-функция)
module.exports = async (req, res) => {
    // Устанавливаем CORS заголовки для безопасности
    res.setHeader('Access-Control-Allow-Origin', '*'); // В идеале здесь должен быть ваш домен
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Проверка метода и получение данных
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST method is allowed' });
    }

    // Извлекаем данные, которые приходят с фронтенда (лендинга)
    const { day, role, theme, userId } = req.body;

    if (!day || !role || !theme) {
        return res.status(400).json({ error: 'Missing day, role, or theme in request body' });
    }

    // --- GOOGLE DRIVE INTEGRATION ---
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    let masterPrompt = DEFAULT_MASTER_PROMPT;
    let knowledgeContext = "";
    let userProgressContext = "";

    if (folderId && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        try {
            // 1. Try to fetch dynamic prompt
            const drivePrompt = await getMasterPrompt(folderId);
            if (drivePrompt) {
                masterPrompt = drivePrompt;
                console.log("Loaded Master Prompt from Drive");
            }

            // 2. Fetch Knowledge Base
            const knowledge = await getKnowledgeBase(folderId);
            if (knowledge) {
                knowledgeContext = `\n\n[KNOWLEDGE BASE]\nUse the following information to inform your advice:\n${knowledge}`;
                console.log("Loaded Knowledge Base from Drive");
            }

            // 3. Fetch User Progress (if userId provided)
            if (userId) {
                const progress = await getUserProgress(folderId, userId);
                if (progress) {
                    userProgressContext = `\n\n[USER PROGRESS]\n${progress}`;
                    console.log("Loaded User Progress from Sheets");
                }
            }

        } catch (e) {
            console.error("Drive Integration Failed (using defaults):", e.message);
        }
    }
    // --------------------------------


    // Заменяем переменные в Master Prompt на фактические данные пользователя
    // Append contexts to the prompt
    const finalSystemPrompt = masterPrompt + knowledgeContext + userProgressContext;

    const finalUserPrompt = finalSystemPrompt
        .replace('{DAY_X}', day)
        .replace('{USER_ROLE}', role)
        .replace('{WEEK_THEME}', theme);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Идеальный выбор по скорости и стоимости
            messages: [
                { role: "system", content: finalSystemPrompt }, // Send the full system context
                { role: "user", content: `Сгенерируй контент для ${day} и роли ${role}. Тема: ${theme}.` } // Explicit user instruction
            ],
            response_format: { type: "json_object" }, // Требуем JSON-вывод
            temperature: 0.7,
        });

        // Парсим JSON из ответа AI
        const content = JSON.parse(response.choices[0].message.content);

        // Отправляем чистый JSON контент обратно на фронтенд
        res.status(200).json(content);

    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        res.status(500).json({ error: 'Failed to generate coaching content.', details: error.message });
    }
};