const { google } = require('googleapis');

// Initialize Auth
const getAuthClient = () => {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    return new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
    });
};

// 1. Fetch Master Prompt from Drive
// 1. Fetch Master Prompt from Drive
async function getMasterPrompt(folderId) {
    try {
        const auth = getAuthClient();
        const drive = google.drive({ version: 'v3', auth });

        // Search for 'master_prompt' (Doc) or 'master_prompt.txt' (Text)
        const res = await drive.files.list({
            q: `'${folderId}' in parents and (name = 'master_prompt' or name = 'master_prompt.txt') and trashed = false`,
            fields: 'files(id, name, mimeType)',
        });

        if (res.data.files.length > 0) {
            const file = res.data.files[0];

            if (file.mimeType === 'application/vnd.google-apps.document') {
                // Export Google Doc as text
                const exportRes = await drive.files.export({
                    fileId: file.id,
                    mimeType: 'text/plain',
                });
                return exportRes.data;
            } else {
                // Download plain text file
                const fileContent = await drive.files.get({
                    fileId: file.id,
                    alt: 'media',
                });
                return fileContent.data;
            }
        }
    } catch (error) {
        console.error('Error fetching master prompt:', error.message);
    }
    return null; // Fallback will be handled in coach.js
}

// 2. Fetch Knowledge Base (Text files from 'Library' folder)
async function getKnowledgeBase(folderId) {
    let knowledgeText = "";
    try {
        const auth = getAuthClient();
        const drive = google.drive({ version: 'v3', auth });

        // Find 'Library' folder inside the main folder
        const folderRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'Library' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: 'files(id)',
        });

        if (folderRes.data.files.length > 0) {
            const libraryId = folderRes.data.files[0].id;

            // List text/doc files in Library
            const filesRes = await drive.files.list({
                q: `'${libraryId}' in parents and (mimeType = 'text/plain' or mimeType = 'application/vnd.google-apps.document') and trashed = false`,
                fields: 'files(id, name, mimeType)',
            });

            for (const file of filesRes.data.files) {
                try {
                    let content;
                    if (file.mimeType === 'application/vnd.google-apps.document') {
                        // Export Google Doc as text
                        content = await drive.files.export({
                            fileId: file.id,
                            mimeType: 'text/plain',
                        });
                    } else {
                        // Download plain text file
                        content = await drive.files.get({
                            fileId: file.id,
                            alt: 'media',
                        });
                    }
                    knowledgeText += `\n--- Source: ${file.name} ---\n${content.data}\n`;
                } catch (e) {
                    console.error(`Failed to read file ${file.name}:`, e.message);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching knowledge base:', error.message);
    }
    return knowledgeText;
}

// 3. Fetch User Progress from 'Progress' Sheet
async function getUserProgress(folderId, userId) {
    try {
        const auth = getAuthClient();
        const drive = google.drive({ version: 'v3', auth });
        const sheets = google.sheets({ version: 'v4', auth });

        // Find 'Progress' sheet
        const fileRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'Progress' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
            fields: 'files(id)',
        });

        if (fileRes.data.files.length > 0) {
            const spreadsheetId = fileRes.data.files[0].id;

            // Read all data from the first sheet
            const sheetData = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'A:Z', // Read whole sheet
            });

            const rows = sheetData.data.values;
            if (!rows || rows.length === 0) return null;

            // Simple search for userId in the first column (assuming A=UserId)
            // Header row is 0, data starts at 1
            const userRow = rows.find(row => row[0] === userId);

            if (userRow) {
                // Return the whole row as context string
                return `User Progress: ${userRow.join(', ')}`;
            }
        }
    } catch (error) {
        console.error('Error fetching user progress:', error.message);
    }
    return null;
}

// 4. Initialize Drive Folder (Create defaults if missing)
async function initializeDrive(folderId) {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });
    const logs = [];

    try {
        // DEBUG: Try to create a timestamped file to verify write access
        const debugFileName = `debug_write_${Date.now()}.txt`;
        await drive.files.create({
            requestBody: {
                name: debugFileName,
                parents: [folderId],
                mimeType: 'text/plain',
            },
            media: {
                mimeType: 'text/plain',
                body: 'Debug write test from Vercel deployment.',
            }
        });
        logs.push(`DEBUG: Successfully created ${debugFileName}`);
        // A. Check/Create master_prompt.txt
        const promptRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'master_prompt.txt' and trashed = false`,
        });

        if (promptRes.data.files.length === 0) {
            await drive.files.create({
                requestBody: {
                    name: 'master_prompt.txt',
                    parents: [folderId],
                    mimeType: 'text/plain',
                },
                media: {
                    mimeType: 'text/plain',
                    body: `Ты — LionLead, AI-компаньон для новоиспеченных менеджеров.
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
}`
                }
            });
            logs.push("Created 'master_prompt.txt'");
        } else {
            logs.push("'master_prompt.txt' already exists");
        }

        // B. Check/Create Library folder
        const libRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'Library' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        });

        if (libRes.data.files.length === 0) {
            await drive.files.create({
                requestBody: {
                    name: 'Library',
                    parents: [folderId],
                    mimeType: 'application/vnd.google-apps.folder',
                }
            });
            logs.push("Created 'Library' folder");
        } else {
            logs.push("'Library' folder already exists");
        }

        // C. Check/Create Progress Sheet
        const sheetRes = await drive.files.list({
            q: `'${folderId}' in parents and name = 'Progress' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
        });

        if (sheetRes.data.files.length === 0) {
            const spreadsheet = await sheets.spreadsheets.create({
                requestBody: {
                    properties: { title: 'Progress' },
                }
            });

            // Move the new sheet into the correct folder (Sheets API creates in root by default)
            const fileId = spreadsheet.data.spreadsheetId;
            // Retrieve existing parents to remove them
            const file = await drive.files.get({ fileId: fileId, fields: 'parents' });
            const previousParents = file.data.parents.join(',');

            await drive.files.update({
                fileId: fileId,
                addParents: folderId,
                removeParents: previousParents,
                fields: 'id, parents',
            });

            // Add header row
            await sheets.spreadsheets.values.update({
                spreadsheetId: fileId,
                range: 'A1:E1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [['UserId', 'Day', 'Role', 'Status', 'Timestamp']]
                }
            });

            logs.push("Created 'Progress' sheet");
        } else {
            logs.push("'Progress' sheet already exists");
        }

        return { success: true, logs };

    } catch (error) {
        console.error("Setup failed:", error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    getMasterPrompt,
    getKnowledgeBase,
    getUserProgress,
    initializeDrive
};
