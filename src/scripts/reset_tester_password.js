const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function syncAuth() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const hash = await bcrypt.hash('password123', 10);
    
    // Create the test user if they don't exist, otherwise update their password to standard
    await c.query(`
        INSERT INTO users (email, password_hash, name, role) 
        VALUES ('testerfinal@example.com', ?, 'Test Automated', 'student')
        ON DUPLICATE KEY UPDATE password_hash = ?
    `, [hash, hash]);

    console.log(`✅ System authenticated! 'testerfinal@example.com' password forced to 'password123'.`);
    await c.end();
}

syncAuth().catch(console.error);
