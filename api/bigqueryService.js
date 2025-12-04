const { BigQuery } = require('@google-cloud/bigquery');

// Initialize BigQuery Client
// Expects GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_KEY env var
// For Vercel, we often parse the JSON key from an env var
const getBigQueryClient = () => {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    return new BigQuery({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials
    });
};

const datasetId = process.env.BIGQUERY_DATASET_ID || 'lionlead_data';
const tableId = process.env.BIGQUERY_TABLE_ID || 'user_progress';

async function saveUserProgress(userId, userName, day, reflection) {
    try {
        const bigquery = getBigQueryClient();

        const rows = [{
            user_id: userId,
            user_name: userName,
            day: day,
            reflection: reflection || '',
            timestamp: BigQuery.timestamp(new Date())
        }];

        await bigquery
            .dataset(datasetId)
            .table(tableId)
            .insert(rows);

        console.log(`Inserted ${rows.length} rows`);
        return true;
    } catch (error) {
        console.error('BigQuery Insert Error:', error);
        return false;
    }
}

async function getUserProgress(userId) {
    try {
        const bigquery = getBigQueryClient();

        // Query to get the latest completed day
        // We select the MAX(day) for the given user
        const query = `
            SELECT MAX(day) as last_completed_day, ARRAY_AGG(STRUCT(day, reflection)) as history
            FROM \`${process.env.GOOGLE_PROJECT_ID}.${datasetId}.${tableId}\`
            WHERE user_id = @userId
            GROUP BY user_id
        `;

        const options = {
            query: query,
            params: { userId: userId },
        };

        const [rows] = await bigquery.query(options);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('BigQuery Query Error:', error);
        return null;
    }
}

module.exports = {
    saveUserProgress,
    getUserProgress
};
