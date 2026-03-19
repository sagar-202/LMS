"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
const repository_1 = require("./repository");
class AuthService {
    generateAccessToken(user) {
        const secret = env_1.env.JWT_SECRET;
        return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, name: user.name }, secret, { expiresIn: env_1.env.JWT_EXPIRES_IN } // 15m
        );
    }
    async generateRefreshToken(userId) {
        // Generate a secure random token
        const refreshToken = crypto_1.default.randomBytes(40).toString('hex');
        // Hash it for database storage
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        // Calculate expiration (e.g., 30 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry
        // Store in DB
        await repository_1.authRepository.storeRefreshToken(userId, tokenHash, expiresAt);
        return refreshToken;
    }
    async register(email, passwordRaw, name) {
        // 1. Check if user already exists
        const existingUser = await repository_1.authRepository.findUserByEmail(email);
        if (existingUser) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }
        // 2. Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(passwordRaw, saltRounds);
        // 3. Store user
        const newUser = await repository_1.authRepository.createUser(email, passwordHash, name);
        // 4. Issue tokens
        const accessToken = this.generateAccessToken(newUser);
        const refreshToken = await this.generateRefreshToken(newUser.id);
        return {
            user: { id: newUser.id, email: newUser.email, name: newUser.name },
            accessToken,
            refreshToken
        };
    }
    async login(email, passwordRaw) {
        // 1. Verify email
        const user = await repository_1.authRepository.findUserByEmail(email);
        if (!user) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        // 2. Compare password
        const isPasswordValid = await bcrypt_1.default.compare(passwordRaw, user.password_hash);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        // 3. Issue tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user.id);
        return {
            user: { id: user.id, email: user.email, name: user.name },
            accessToken,
            refreshToken
        };
    }
    async refresh(refreshTokenRaw) {
        // 1. Hash the incoming token
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshTokenRaw).digest('hex');
        // 2. Check DB for valid refresh token
        const tokenRecord = await repository_1.authRepository.findRefreshToken(tokenHash);
        if (!tokenRecord) {
            const error = new Error('Invalid or expired refresh token');
            error.statusCode = 401;
            throw error;
        }
        // Optional: We do not strictly need the full user record here, but we should fetch it to generate a new access token
        const dbPool = require('../../config/db').default;
        const [rows] = await dbPool.query('SELECT * FROM users WHERE id = ?', [tokenRecord.user_id]);
        const user = rows[0];
        if (!user) {
            const error = new Error('User associated with token not found');
            error.statusCode = 401;
            throw error;
        }
        // 3. Issue new access token
        const accessToken = this.generateAccessToken(user);
        // Note: We could implement refresh token rotation here, but keeping it simple for now based on requirements.
        return { accessToken };
    }
    async logout(refreshTokenRaw) {
        if (!refreshTokenRaw)
            return;
        // Hash the token and revoke it in the database
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshTokenRaw).digest('hex');
        await repository_1.authRepository.revokeRefreshToken(tokenHash);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=service.js.map