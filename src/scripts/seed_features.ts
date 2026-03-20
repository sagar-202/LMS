/**
 * Feature Seed Script
 * Inserts sample quiz, attachments, and promotes a user to instructor
 * Run: npm run seed:features
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;

async function seed() {
    const c = await mysql.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    console.log(`\n✅ Connected to ${DB_NAME}\n`);

    // 1. Find existing videos
    const [videos] = await c.query<any[]>('SELECT id, title FROM videos LIMIT 5');
    console.log('Found videos:', videos.map((v: any) => `[${v.id}] ${v.title}`).join(', '));

    if (!videos.length) {
        console.log('❌ No videos found. Cannot seed features without videos.');
        await c.end();
        return;
    }

    const videoId = videos[0].id; // Use first video for seeding
    console.log(`\n🎯 Seeding features for video ID: ${videoId} ("${videos[0].title}")\n`);

    // 2. Find existing users
    const [users] = await c.query<any[]>('SELECT id, name, email, role FROM users WHERE email = ?', ['testerfinal@example.com']);
    if (users.length === 0) {
        console.log('❌ User testerfinal@example.com not found. Please register first.');
        await c.end();
        return;
    }
    const user = users[0];
    console.log(`👤 User: [${user.id}] ${user.email} (Role: ${user.role})`);

    // 3. Ensure instructor role
    if (user.role !== 'instructor' && user.role !== 'admin') {
        await c.query('UPDATE users SET role = ? WHERE id = ?', ['instructor', user.id]);
        console.log(`👑 Promoted ${user.email} to instructor`);
    }

    // 4. Check enrollment for subject 27
    const subjectId = 27;
    const [enrollments] = await c.query<any[]>('SELECT * FROM enrollments WHERE user_id = ? AND subject_id = ?', [user.id, subjectId]);
    if (enrollments.length === 0) {
        await c.query('INSERT INTO enrollments (user_id, subject_id) VALUES (?, ?)', [user.id, subjectId]);
        console.log(`📝 Enrolled ${user.email} in subject ${subjectId}`);
    } else {
        console.log(`✅ ${user.email} already enrolled in subject ${subjectId}`);
    }

    // 5. Insert quiz for video 69
    const targetVideoId = 69;
    const [existing] = await c.query<any[]>('SELECT id FROM quizzes WHERE video_id = ?', [targetVideoId]);
    let quizId: number;

    if (existing.length > 0) {
        quizId = existing[0].id;
        console.log(`\n⏭️  Quiz already exists for video ${videoId} (quiz ID: ${quizId}), skipping quiz insert.`);
    } else {
        const [quizResult] = await c.query<any>(
            'INSERT INTO quizzes (video_id, title, passing_score) VALUES (?, ?, ?)',
            [targetVideoId, 'Quick Knowledge Check', 70]
        );
        quizId = quizResult.insertId;
        console.log(`\n✅ Created quiz ID: ${quizId}`);

        // 5. Insert questions
        const questions = [
            {
                text: 'What is Machine Learning?',
                answers: [
                    { text: 'A type of coffee machine', correct: false },
                    { text: 'A subset of AI that enables systems to learn from data', correct: true },
                    { text: 'A programming language', correct: false },
                    { text: 'A database management system', correct: false },
                ]
            },
            {
                text: 'Which of the following is a supervised learning algorithm?',
                answers: [
                    { text: 'K-Means Clustering', correct: false },
                    { text: 'Linear Regression', correct: true },
                    { text: 'PCA (Principal Component Analysis)', correct: false },
                    { text: 'DBSCAN', correct: false },
                ]
            },
            {
                text: 'What does "training a model" mean?',
                answers: [
                    { text: 'Installing ML software', correct: false },
                    { text: 'Running the model on test data', correct: false },
                    { text: 'Adjusting model parameters using data to minimize error', correct: true },
                    { text: 'Deleting old data', correct: false },
                ]
            }
        ];

        for (const q of questions) {
            const [qResult] = await c.query<any>(
                'INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)',
                [quizId, q.text]
            );
            const questionId = qResult.insertId;
            console.log(`  ✅ Question: "${q.text.slice(0, 40)}..."`);

            for (const a of q.answers) {
                await c.query(
                    'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)',
                    [questionId, a.text, a.correct]
                );
            }
        }
        console.log(`✅ Inserted ${questions.length} questions with answers.`);
    }

    // 6. Insert attachment for the video
    const [existingAtt] = await c.query<any[]>('SELECT id FROM lesson_attachments WHERE lesson_id = ?', [targetVideoId]);
    if (existingAtt.length > 0) {
        console.log(`\n⏭️  Attachment already exists for video ${targetVideoId}, skipping.`);
    } else {
        await c.query(
            'INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)',
            [targetVideoId, 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf', 'pdf']
        );
        console.log(`\n✅ Inserted PDF attachment for lesson ${targetVideoId}`);
    }

    await c.end();
    console.log('\n🎉 Seed complete! Refresh the lesson page to see Quiz and Attachments.');
}

seed().catch((err) => {
    console.error('💥 Seed failed:', err.message);
    process.exit(1);
});
