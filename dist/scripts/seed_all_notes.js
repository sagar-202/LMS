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
const RESOURCE_MAP = {
    'Machine Learning Basics': [
        { url: 'https://developers.google.com/machine-learning/crash-course', type: 'link' },
        { url: 'https://en.wikipedia.org/wiki/Machine_learning', type: 'link' }
    ],
    'Data Science 101': [
        { url: 'https://pandas.pydata.org/docs/getting_started/index.html', type: 'link' },
        { url: 'https://scikit-learn.org/stable/tutorial/index.html', type: 'link' }
    ],
    'Docker & DevOps': [
        { url: 'https://docs.docker.com/get-started/', type: 'link' },
        { url: 'https://roadmap.sh/devops', type: 'link' }
    ],
    'NextJS Mastery': [
        { url: 'https://nextjs.org/docs', type: 'link' },
        { url: 'https://react.dev/learn', type: 'link' }
    ],
    'React Crash Course': [
        { url: 'https://react.dev/reference/react', type: 'link' },
        { url: 'https://javascript.info/', type: 'link' }
    ],
    'Full Stack Web Dev': [
        { url: 'https://developer.mozilla.org/en-US/docs/Learn', type: 'link' },
        { url: 'https://nodejs.org/en/docs/', type: 'link' }
    ],
    'Python for Beginners': [
        { url: 'https://docs.python.org/3/tutorial/index.html', type: 'link' },
        { url: 'https://realpython.com/', type: 'link' }
    ],
    'default': [
        { url: 'https://developer.mozilla.org/en-US/', type: 'link' },
        { url: 'https://roadmap.sh/', type: 'link' }
    ]
};
async function seedAllNotes() {
    const c = await promise_1.default.createConnection({
        host: DB_HOST, port: parseInt(DB_PORT),
        user: DB_USER, password: DB_PASSWORD,
        database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });
    console.log(`\n✅ Connected to ${DB_NAME}\n`);
    // Fetch all videos natively mapped to their subjects to properly contextualize the injected links
    const [videos] = await c.query(`
        SELECT v.id as video_id, v.title as video_title, s.title as subject_title 
        FROM videos v 
        JOIN sections sec ON v.section_id = sec.id 
        JOIN subjects s ON sec.subject_id = s.id
    `);
    console.log(`🔍 Found ${videos.length} videos across the curriculum.`);
    // Purge the old dummy PDFs dynamically only
    console.log(`🗑️ Sweeping old dummy W3C generic PDF placeholders across the curriculum...`);
    await c.query(`DELETE FROM lesson_attachments WHERE file_url LIKE '%WAI/WCAG21/Techniques/pdf/%'`);
    let insertions = 0;
    for (const v of videos) {
        const resources = RESOURCE_MAP[v.subject_title] || RESOURCE_MAP['default'];
        // Determine if video already has attachments to prevent duplicating them indefinitely if script is run multiple times
        const [existing] = await c.query('SELECT id FROM lesson_attachments WHERE lesson_id = ?', [v.video_id]);
        if (existing.length === 0) {
            for (const res of resources) {
                await c.query('INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)', [v.video_id, res.url, 'pdf'] // using `pdf` to inherently bypass strict ENUM DB constraints if they exist on older schema iterations
                );
                insertions++;
            }
        }
    }
    console.log(`\n🔥 Success! Seamlessly injected ${insertions} highly context-authentic developer resources globally across all courses!\n`);
    await c.end();
}
seedAllNotes().catch(err => {
    console.error('💥 Seeding failed:', err.message);
    process.exit(1);
});
//# sourceMappingURL=seed_all_notes.js.map