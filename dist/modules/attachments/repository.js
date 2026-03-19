"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsRepository = exports.AttachmentsRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class AttachmentsRepository {
    async create(lessonId, fileUrl, fileType) {
        const query = 'INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)';
        const [result] = await db_1.default.query(query, [lessonId, fileUrl, fileType]);
        const [rows] = await db_1.default.query('SELECT * FROM lesson_attachments WHERE id = ?', [result.insertId]);
        return rows[0];
    }
    async getByLessonId(lessonId) {
        const query = 'SELECT * FROM lesson_attachments WHERE lesson_id = ? ORDER BY created_at DESC';
        const [rows] = await db_1.default.query(query, [lessonId]);
        return rows;
    }
}
exports.AttachmentsRepository = AttachmentsRepository;
exports.attachmentsRepository = new AttachmentsRepository();
//# sourceMappingURL=repository.js.map