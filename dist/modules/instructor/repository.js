"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorRepository = exports.InstructorRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class InstructorRepository {
    async createSubject(data) {
        const query = `
            INSERT INTO subjects (title, slug, description, difficulty, category, is_published) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db_1.default.query(query, [
            data.title, data.slug, data.description, data.difficulty, data.category, data.is_published ?? true
        ]);
        return result.insertId;
    }
    async addInstructorToCourse(subjectId, userId) {
        const query = 'INSERT INTO course_instructors (subject_id, user_id) VALUES (?, ?)';
        await db_1.default.query(query, [subjectId, userId]);
    }
    async getSubjectsByInstructor(userId) {
        const query = `
            SELECT s.* 
            FROM subjects s
            JOIN course_instructors ci ON s.id = ci.subject_id
            WHERE ci.user_id = ?
            ORDER BY s.created_at DESC
        `;
        const [rows] = await db_1.default.query(query, [userId]);
        return rows;
    }
    async createSection(subjectId, title, orderIndex) {
        const query = 'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)';
        const [result] = await db_1.default.query(query, [subjectId, title, orderIndex]);
        return result.insertId;
    }
    async createVideo(sectionId, data) {
        const query = `
            INSERT INTO videos (section_id, title, youtube_video_id, order_index, description, duration_seconds) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db_1.default.query(query, [
            sectionId, data.title, data.youtube_video_id, data.order_index, data.description, data.duration_seconds ?? 0
        ]);
        return result.insertId;
    }
    async isInstructorOfCourse(userId, subjectId) {
        const query = 'SELECT 1 FROM course_instructors WHERE user_id = ? AND subject_id = ? LIMIT 1';
        const [rows] = await db_1.default.query(query, [userId, subjectId]);
        return rows.length > 0;
    }
}
exports.InstructorRepository = InstructorRepository;
exports.instructorRepository = new InstructorRepository();
//# sourceMappingURL=repository.js.map