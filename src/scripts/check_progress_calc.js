const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function run() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const query = `
        SELECT 
            COUNT(v.id) as total_videos,
            SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) as completed_videos
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = 15
        WHERE s.subject_id = 27
    `;
    const [stats] = await c.query(query);
    console.log("Stats query result:", stats);

    const [vp] = await c.query('SELECT video_id, is_completed FROM video_progress WHERE user_id = 15');
    console.log("Raw progress rows:", vp);

    c.end();
}
run();
