"use strict";
/**
 * Production Migration Script (No-FK version for maximum compatibility)
 * Run with: npm run migrate
 *
 * Creates all new feature tables without foreign key constraints
 * to avoid cross-table type incompatibility issues on production.
 * Idempotent: safe to run multiple times.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db', } = process.env;
const IGNORED_ERRORS = new Set([
    'ER_DUP_FIELDNAME', // Column already exists
    'ER_TABLE_EXISTS_ERROR', // Table already exists (shouldn't happen with IF NOT EXISTS but just in case)
]);
async function runMigrations() {
    const connection = await promise_1.default.createConnection({
        host: DB_HOST,
        port: parseInt(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false },
    });
    console.log(`\n✅ Connected to: ${DB_NAME} @ ${DB_HOST}\n`);
    const migrations = [
        // ─── 1. RBAC ──────────────────────────────────────────────────
        {
            name: '1. RBAC — Add role column to users',
            sql: `ALTER TABLE users ADD COLUMN role ENUM('student','instructor','admin') NOT NULL DEFAULT 'student' AFTER name`
        },
        // ─── 2. Certificates ──────────────────────────────────────────
        {
            name: '2. Certificates table',
            sql: `CREATE TABLE IF NOT EXISTS certificates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                subject_id INT NOT NULL,
                issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                certificate_url VARCHAR(255) NOT NULL,
                UNIQUE KEY unique_user_subject (user_id, subject_id)
            )`
        },
        // ─── 3. Quizzes ───────────────────────────────────────────────
        {
            name: '3. Quizzes table',
            sql: `CREATE TABLE IF NOT EXISTS quizzes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                video_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                passing_score INT DEFAULT 70
            )`
        },
        {
            name: '4. Questions table',
            sql: `CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                quiz_id INT NOT NULL,
                question_text TEXT NOT NULL
            )`
        },
        {
            name: '5. Answers table',
            sql: `CREATE TABLE IF NOT EXISTS answers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_id INT NOT NULL,
                answer_text TEXT NOT NULL,
                is_correct BOOLEAN DEFAULT FALSE
            )`
        },
        {
            name: '6. User quiz attempts table',
            sql: `CREATE TABLE IF NOT EXISTS user_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                quiz_id INT NOT NULL,
                score INT NOT NULL,
                is_passed BOOLEAN NOT NULL,
                attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        },
        // ─── 4. Instructor CMS ────────────────────────────────────────
        {
            name: '7. Course instructors table',
            sql: `CREATE TABLE IF NOT EXISTS course_instructors (
                subject_id INT NOT NULL,
                user_id INT NOT NULL,
                PRIMARY KEY (subject_id, user_id)
            )`
        },
        // ─── 5. Attachments ───────────────────────────────────────────
        {
            name: '8. Lesson attachments table',
            sql: `CREATE TABLE IF NOT EXISTS lesson_attachments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lesson_id INT NOT NULL,
                file_url VARCHAR(255) NOT NULL,
                file_type ENUM('pdf','zip','doc','docx','other') NOT NULL DEFAULT 'other',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        },
        // ─── 6. Comments ──────────────────────────────────────────────
        {
            name: '9. Comments / Discussions table',
            sql: `CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lesson_id INT NOT NULL,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                parent_id INT DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_lesson (lesson_id),
                INDEX idx_parent (parent_id)
            )`
        },
    ];
    let passed = 0;
    let skipped = 0;
    let failed = 0;
    for (const m of migrations) {
        try {
            await connection.query(m.sql);
            console.log(`  ✅ ${m.name}`);
            passed++;
        }
        catch (error) {
            const err = error;
            if (err.code && IGNORED_ERRORS.has(err.code)) {
                console.log(`  ⏭️  ${m.name} — already applied, skipping.`);
                skipped++;
            }
            else {
                console.error(`  ❌ ${m.name} — FAILED: ${err.sqlMessage || err.message}`);
                failed++;
                // Don't throw — continue with remaining migrations
            }
        }
    }
    await connection.end();
    console.log(`\n──────────────────────────────────`);
    console.log(`Migration Results:`);
    console.log(`  ✅ Applied : ${passed}`);
    console.log(`  ⏭️  Skipped : ${skipped}`);
    console.log(`  ❌ Failed  : ${failed}`);
    console.log(`──────────────────────────────────`);
    if (failed > 0) {
        console.log(`\n⚠️  Some migrations failed. Check the errors above.`);
        process.exit(1);
    }
    else {
        console.log(`\n🎉 All migrations completed successfully!`);
    }
}
runMigrations().catch((err) => {
    console.error('\n💥 Fatal migration error:', err.message);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map