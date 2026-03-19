"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepository = exports.CommentsRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class CommentsRepository {
    async create(data) {
        const query = `
            INSERT INTO comments (lesson_id, user_id, content, parent_id) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db_1.default.query(query, [
            data.lesson_id, data.user_id, data.content, data.parent_id ?? null
        ]);
        return result.insertId;
    }
    async getByLessonId(lessonId) {
        const query = `
            SELECT 
                c.*, 
                u.name as user_name, 
                u.role as user_role
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.lesson_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await db_1.default.query(query, [lessonId]);
        return rows;
    }
    async getById(commentId) {
        const query = `
            SELECT 
                c.*, 
                u.name as user_name, 
                u.role as user_role
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `;
        const [rows] = await db_1.default.query(query, [commentId]);
        if (!rows || rows.length === 0)
            return null;
        return rows[0];
    }
}
exports.CommentsRepository = CommentsRepository;
exports.commentsRepository = new CommentsRepository();
//# sourceMappingURL=repository.js.map