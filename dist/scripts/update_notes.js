"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'lms_db' } = process.env;
async function updateNotes() {
    const c = await promise_1.default.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });
    console.log(`\n✅ Connected to ${DB_NAME}\n`);
    // Delete existing dummy attachment for lesson 69
    await c.query('DELETE FROM lesson_attachments WHERE lesson_id = 69');
    console.log('🗑️ Deleted old dummy attachments for lesson 69');
    // Insert real ML Notes (Stanford CS229 Supervised Learning Cheatsheet)
    await c.query('INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)', [69, 'https://stanford.edu/~shervine/teaching/cs-229/cheatsheet-supervised-learning.pdf', 'pdf']);
    // Insert GitHub reference for ML algorithms
    await c.query('INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)', [69, 'https://github.com/afshinea/stanford-cs-229-machine-learning/raw/master/en/cheatsheet-supervised-learning.pdf', 'pdf']);
    console.log('✅ Inserted authentic Stanford ML Cheatsheets for lesson 69');
    // Also update seed_features for future local runs
    await c.end();
}
updateNotes().catch(err => {
    console.error('💥 Update failed:', err.message);
    process.exit(1);
});
//# sourceMappingURL=update_notes.js.map