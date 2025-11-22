// Импорт Google Generative AI
// Установите библиотеку: npm install @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Инициализируем Google Generative AI. Ключ берется из переменных окружения
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Ваш Master Prompt (система инструкций для AI)
const MASTER_PROMPT = `
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
    const { day, role, theme } = req.body;

    if (!day || !role || !theme) {
        return res.status(400).json({ error: 'Missing day, role, or theme in request body' });
    }

    // Заменяем переменные в Master Prompt на фактические данные пользователя
    const response = await result.response;
    const text = response.text();

    // Парсим JSON из ответа AI
    const content = JSON.parse(text);

    // Отправляем чистый JSON контент обратно на фронтенд
    res.status(200).json(content);

} catch (error) {
    console.error("Google Gemini API Error:", error.message);
    res.status(500).json({ error: 'Failed to generate coaching content.', details: error.message });
}
};