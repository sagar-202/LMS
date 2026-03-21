const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function seedGlobalQuizzes() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    console.log(`\n✅ Connected to ${DB_NAME}\n`);

    // Fetch all active subjects and join to their first video by order index
    const [subjects] = await c.query(`
        SELECT s.id as subject_id, s.title as subject_title, MIN(v.id) as first_video_id
        FROM subjects s
        JOIN sections sec ON sec.subject_id = s.id
        JOIN videos v ON v.section_id = sec.id
        WHERE v.order_index = 0 OR v.order_index = 1
        GROUP BY s.id, s.title
    `);

    console.log(`🔍 Found ${subjects.length} courses with identifiable target videos for global quizzes.\n`);

    let insertions = 0;

    for (const sub of subjects) {
        // Check if this video already has a quiz
        const [existingQuiz] = await c.query('SELECT id FROM quizzes WHERE video_id = ?', [sub.first_video_id]);
        
        if (existingQuiz.length === 0) {
            console.log(`⚡ Injecting Global Assessment for [${sub.subject_title}]...`);
            
            const [quizRes] = await c.query(
                'INSERT INTO quizzes (video_id, title, passing_score) VALUES (?, ?, ?)',
                [sub.first_video_id, `${sub.subject_title} Knowledge Check`, 70]
            );
            
            const newQuizId = quizRes.insertId;

            // Insert standard baseline question
            const [qRes] = await c.query(
                'INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)',
                [newQuizId, `What is the primary purpose of ${sub.subject_title}?`]
            );
            
            const questionId = qRes.insertId;

            // Insert standard baseline answers
            await c.query('INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)', [questionId, `A generic incorrect assumption`, false]);
            await c.query('INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)', [questionId, `The core industry standard methodology taught in this course`, true]);
            await c.query('INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)', [questionId, `An outdated legacy framework`, false]);
            await c.query('INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)', [questionId, `None of the above`, false]);

            insertions++;
        }
    }

    console.log(`\n🎉 Success! Added ${insertions} new automated quizzes across the platform!`);
    await c.end();
}

seedGlobalQuizzes().catch(err => {
    console.error('💥 Seeding Failed:', err.message);
    process.exit(1);
});
