import express from 'express';
import db from '../../config/db';

const router = express.Router();

router.get('/seed', async (req, res) => {
    try {
        // 0. Auto-Migrate Schemas safely
        const schemas = [
            `CREATE TABLE IF NOT EXISTS video_progress (user_id INT NOT NULL, video_id INT NOT NULL, last_position_seconds INT DEFAULT 0, is_completed BOOLEAN DEFAULT FALSE, completed_at DATETIME NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (user_id, video_id))`,
            `CREATE TABLE IF NOT EXISTS quizzes (id INT AUTO_INCREMENT PRIMARY KEY, video_id INT NOT NULL, title VARCHAR(255) NOT NULL, passing_score INT DEFAULT 70)`,
            `CREATE TABLE IF NOT EXISTS questions (id INT AUTO_INCREMENT PRIMARY KEY, quiz_id INT NOT NULL, question_text TEXT NOT NULL, type VARCHAR(50) DEFAULT 'multiple_choice')`,
            `CREATE TABLE IF NOT EXISTS answers (id INT AUTO_INCREMENT PRIMARY KEY, question_id INT NOT NULL, answer_text TEXT NOT NULL, is_correct BOOLEAN DEFAULT FALSE)`,
            `CREATE TABLE IF NOT EXISTS attachments (id INT AUTO_INCREMENT PRIMARY KEY, video_id INT NOT NULL, title VARCHAR(255) NOT NULL, file_url VARCHAR(255) NOT NULL, file_type ENUM('pdf','zip','doc','docx','other') DEFAULT 'other', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
        ];
        
        for (const sql of schemas) {
            try { await db.query(sql); } catch(e) { console.warn('Migration warning:', e); }
        }

        // 1. Seed Quizzes
        const [videos] = await db.query('SELECT id, section_id FROM videos');
        let quizzesSeeded = 0;
        let notesSeeded = 0;

        for (const video of videos as { id: number; section_id: number }[]) {
            // 1. Seed Quizzes
            try {
                const [q] = await db.query('SELECT id FROM quizzes WHERE video_id = ?', [video.id]);
                if ((q as unknown[]).length === 0) {
                    const [r] = await db.query('INSERT INTO quizzes (video_id, title) VALUES (?, ?)', [video.id, 'Knowledge Check']);
                    const quizId = (r as { insertId: number }).insertId;
                    const [rq] = await db.query('INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)', [quizId, 'What is the primary concept discussed in this lesson?']);
                    const qId = (rq as { insertId: number }).insertId;
                    await db.query(`INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
                        (?, ?, true), (?, ?, false), (?, ?, false)`, 
                        [qId, 'The core architecture and implementation details.', qId, 'A completely unrelated topic.', qId, 'General programming history.']
                    );
                    quizzesSeeded++;
                }
            } catch (eq) { console.warn('Quiz seed failed for video', video.id, eq); }

            // 2. Seed Notes
            try {
                const [a] = await db.query("SELECT id FROM attachments WHERE video_id = ? AND file_url LIKE '%wikipedia%'", [video.id]);
                if ((a as unknown[]).length === 0) {
                    await db.query(`INSERT INTO attachments (video_id, title, file_url) VALUES 
                        (?, ?, ?), (?, ?, ?)`, 
                        [video.id, 'Wikipedia Overview', 'https://en.wikipedia.org/wiki/Portal:Technology', 
                         video.id, 'Official Documentation', 'https://roadmap.sh/']
                    );
                    notesSeeded++;
                }
            } catch (ea) { console.warn('Notes seed failed for video', video.id, ea); }
        }

        res.json({ success: true, message: `Production Seed Complete. Injected ${quizzesSeeded} quizzes and ${notesSeeded * 2} notes.` });
    } catch (error: unknown) {
        console.error('Seed Error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
});

export default router;
