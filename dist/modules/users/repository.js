"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class UserRepository {
    /**
     * Example: Find a user by their email
     */
    async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
        // Using the exported db pool to query
        const [rows] = await db_1.default.query(query, [email]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    /**
     * Example: Return all users
     */
    async findAll() {
        const query = `SELECT * FROM users ORDER BY created_at DESC`;
        const [rows] = await db_1.default.query(query);
        return rows;
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=repository.js.map