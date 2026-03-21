const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function maxProgression() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    // 1. Get our test user
    const [users] = await c.query('SELECT id FROM users WHERE email = ?', ['testerfinal@example.com']);
    if (!users.length) {
        console.error('Test user testerfinal@example.com not found!');
        process.exit(1);
    }
    const userId = users[0].id;

    // 2. Identify all video chunks belonging to Subject 27 (Machine Learning Basics)
    const [videos] = await c.query(`
        SELECT v.id 
        FROM videos v
        JOIN sections sec ON sec.id = v.section_id
        WHERE sec.subject_id = 27
    `);

    // 3. Force 100% completion in DB
    for (const v of videos) {
        await c.query(`
            INSERT INTO progress (user_id, video_id, completed) 
            VALUES (?, ?, true) 
            ON DUPLICATE KEY UPDATE completed = true
        `, [userId, v.id]);
    }

    console.log(`✅ Systematically marked ${videos.length} components complete for testerfinal@example.com across Subject 27.`);

    await c.end();
}

maxProgression().catch(console.error);
