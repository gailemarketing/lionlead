const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Manually load .env
try {
    const envPath = path.resolve(__dirname, '.env');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.warn("Could not read .env file:", e.message);
}

async function testWrite() {
    try {
        console.log("Initializing Auth...");
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const drive = google.drive({ version: 'v3', auth });
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        console.log(`Target Folder ID: ${folderId}`);

        // Create a test file
        const fileName = `test_connection_${Date.now()}.txt`;
        console.log(`Attempting to create file: ${fileName}`);

        const res = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
                mimeType: 'text/plain',
            },
            media: {
                mimeType: 'text/plain',
                body: 'Hello from LionLead Test Script! If you see this, write access is working.',
            }
        });

        console.log("Success! File created.");
        console.log("File ID:", res.data.id);
        console.log("File Name:", res.data.name);

    } catch (error) {
        console.error("FAILED to write to Drive:");
        console.error(error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testWrite();
