import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function listVideos() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const [videos] = await c.query<any[]>('SELECT v.id as video_id, v.title as video_title, s.title as subject_title FROM videos v JOIN sections sec ON v.section_id = sec.id JOIN subjects s ON sec.subject_id = s.id');
    console.log(JSON.stringify(videos, null, 2));

    await c.end();
}

listVideos().catch(err => {
    console.error(err);
    process.exit(1);
});
