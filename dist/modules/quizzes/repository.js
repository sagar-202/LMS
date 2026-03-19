"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizzesRepository = exports.QuizzesRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class QuizzesRepository {
    async getQuizByVideoId(videoId) {
        const query = 'SELECT * FROM quizzes WHERE video_id = ? LIMIT 1';
        const [rows] = await db_1.default.query(query, [videoId]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
    async getQuestionsByQuizId(quiz_id) {
        const query = 'SELECT * FROM questions WHERE quiz_id = ?';
        const [rows] = await db_1.default.query(query, [quiz_id]);
        return rows;
    }
    async getAnswersByQuestionIds(questionIds) {
        if (questionIds.length === 0)
            return [];
        const placeholders = questionIds.map(() => '?').join(',');
        const query = `SELECT * FROM answers WHERE question_id IN (${placeholders})`;
        const [rows] = await db_1.default.query(query, questionIds);
        return rows;
    }
    async saveAttempt(userId, quizId, score, isPassed) {
        const query = 'INSERT INTO user_attempts (user_id, quiz_id, score, is_passed) VALUES (?, ?, ?, ?)';
        const [result] = await db_1.default.query(query, [userId, quizId, score, isPassed]);
        const [rows] = await db_1.default.query('SELECT * FROM user_attempts WHERE id = ?', [result.insertId]);
        return rows[0];
    }
    async getBestAttempt(userId, quizId) {
        const query = 'SELECT * FROM user_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY score DESC LIMIT 1';
        const [rows] = await db_1.default.query(query, [userId, quizId]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
}
exports.QuizzesRepository = QuizzesRepository;
exports.quizzesRepository = new QuizzesRepository();
//# sourceMappingURL=repository.js.map