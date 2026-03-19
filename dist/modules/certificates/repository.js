"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificatesRepository = exports.CertificatesRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class CertificatesRepository {
    async create(userId, subjectId, url) {
        const query = 'INSERT INTO certificates (user_id, subject_id, certificate_url) VALUES (?, ?, ?)';
        const [result] = await db_1.default.query(query, [userId, subjectId, url]);
        const [rows] = await db_1.default.query('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
        return rows[0];
    }
    async findByUserAndSubject(userId, subjectId) {
        const query = 'SELECT * FROM certificates WHERE user_id = ? AND subject_id = ? LIMIT 1';
        const [rows] = await db_1.default.query(query, [userId, subjectId]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
    async findByUserId(userId) {
        const query = `
            SELECT c.*, s.title as subject_title 
            FROM certificates c
            JOIN subjects s ON c.subject_id = s.id
            WHERE c.user_id = ?
            ORDER BY c.issued_at DESC
        `;
        const [rows] = await db_1.default.query(query, [userId]);
        return rows;
    }
}
exports.CertificatesRepository = CertificatesRepository;
exports.certificatesRepository = new CertificatesRepository();
//# sourceMappingURL=repository.js.map