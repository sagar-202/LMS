const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        const [users] = await pool.query('SELECT id, email FROM users WHERE email = ?', ['testuser2@example.com']);
        if (users.length === 0) {
            console.log('User not found');
            process.exit(0);
        }
        const userId = users[0].id;
        console.log('User ID:', userId);

        // Simulate Lesson 2 completion
        await pool.query('INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_completed = 1', [userId, 72, 0, 1]);
        await pool.query('INSERT INTO user_attempts (user_id, quiz_id, score, is_passed) VALUES (?, ?, ?, ?)', [userId, 20, 100, 1]);

        const [enrollments] = await pool.query('SELECT * FROM enrollments WHERE user_id = ?', [userId]);
        console.log('Enrollments:', enrollments);

        const [progress] = await pool.query('SELECT * FROM video_progress WHERE user_id = ?', [userId]);
        console.log('Progress:', progress);

        const statsQuery = `
            SELECT 
                (
                    SELECT COUNT(*)
                    FROM video_progress vp
                    JOIN videos v ON vp.video_id = v.id
                    JOIN sections s ON v.section_id = s.id
                    WHERE vp.user_id = ? AND vp.is_completed = 1
                    AND s.subject_id IN (SELECT subject_id FROM enrollments WHERE user_id = ?)
                ) as completed_lessons,
                (
                    SELECT COUNT(*)
                    FROM videos v
                    JOIN sections s ON v.section_id = s.id
                    WHERE s.subject_id IN (SELECT subject_id FROM enrollments WHERE user_id = ?)
                ) as total_lessons
        `;
        const [stats] = await pool.query(statsQuery, [userId, userId, userId]);
        console.log('Stats Query Result:', stats);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
