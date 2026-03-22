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

    const [subs] = await c.query("SELECT id, title FROM subjects WHERE title LIKE '%Machine Learning%'");
    console.log("Found subjects:", subs);
    c.end();
}
run();
