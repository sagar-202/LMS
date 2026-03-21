"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class AuthRepository {
    async createUser(email, passwordHash, name, role = 'student') {
        const query = 'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)';
        const [result] = await db_1.default.query(query, [email, passwordHash, name, role]);
        // Fetch and return the newly created user
        const [rows] = await db_1.default.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return rows[0];
    }
    async findUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        const [rows] = await db_1.default.query(query, [email]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
    async storeRefreshToken(userId, tokenHash, expiresAt) {
        const query = 'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)';
        await db_1.default.query(query, [userId, tokenHash, expiresAt]);
    }
    async findRefreshToken(tokenHash) {
        const query = 'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1';
        const [rows] = await db_1.default.query(query, [tokenHash]);
        if (rows.length === 0)
            return null;
        return rows[0] || null;
    }
    async revokeRefreshToken(tokenHash) {
        const query = 'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL';
        await db_1.default.query(query, [tokenHash]);
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
//# sourceMappingURL=repository.js.map