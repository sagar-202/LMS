import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function updateNotes() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    console.log(`\n✅ Connected to ${DB_NAME}\n`);

    // Delete existing attachment for lesson 69
    await c.query('DELETE FROM lesson_attachments WHERE lesson_id = 69');
    console.log('🗑️ Deleted old attachments for lesson 69');

    // Insert Google ML Crash Course
    await c.query(
        'INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)',
        [69, 'https://developers.google.com/machine-learning/crash-course', 'pdf']
    );

    // Insert Wikipedia Machine Learning
    await c.query(
        'INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)',
        [69, 'https://en.wikipedia.org/wiki/Machine_learning', 'pdf']
    );

    console.log('✅ Inserted free source web links for lesson 69');
    
    await c.end();
}

updateNotes().catch(err => {
    console.error('💥 Update failed:', err.message);
    process.exit(1);
});
