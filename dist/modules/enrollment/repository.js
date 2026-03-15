"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentRepository = exports.EnrollmentRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class EnrollmentRepository {
    async enrollUser(userId, subjectId) {
        const query = 'INSERT IGNORE INTO enrollments (user_id, subject_id) VALUES (?, ?)';
        await db_1.default.query(query, [userId, subjectId]);
    }
    async getEnrollmentsByUserId(userId) {
        const query = 'SELECT subject_id FROM enrollments WHERE user_id = ?';
        const [rows] = await db_1.default.query(query, [userId]);
        return rows.map(row => row.subject_id);
    }
    async isUserEnrolled(userId, subjectId) {
        const query = 'SELECT 1 FROM enrollments WHERE user_id = ? AND subject_id = ? LIMIT 1';
        const [rows] = await db_1.default.query(query, [userId, subjectId]);
        return rows.length > 0;
    }
}
exports.EnrollmentRepository = EnrollmentRepository;
exports.enrollmentRepository = new EnrollmentRepository();
//# sourceMappingURL=repository.js.map