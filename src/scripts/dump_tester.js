const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function dump() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const [u] = await c.query("SELECT * FROM users WHERE email='testerfinal@example.com'");
    if(!u.length) return console.log('user missing');
    const user = u[0];

    // Ensure enrollment exists to 27
    await c.query('INSERT IGNORE INTO enrollments (user_id, subject_id) VALUES (?, 27)', [user.id]);
    const [e] = await c.query('SELECT * FROM enrollments WHERE user_id=?', [user.id]);
    
    // Check progress
    const [vp] = await c.query('SELECT * FROM video_progress WHERE user_id=?', [user.id]);
    console.log('Enrollments:', e.length);
    console.log('Progress records:', vp.length);
    console.log(vp);
    process.exit(0);
}
dump();
