import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { authRepository } from './repository';
import { User } from '../users/repository';

export class AuthService {
    private generateAccessToken(user: User): string {
        const secret: jwt.Secret = env.JWT_SECRET;
        return jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            secret,
            { expiresIn: env.JWT_EXPIRES_IN as any } // 15m
        );
    }

    private async generateRefreshToken(userId: number): Promise<string> {
        // Generate a secure random token
        const refreshToken = crypto.randomBytes(40).toString('hex');

        // Hash it for database storage
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        // Calculate expiration (e.g., 30 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry

        // Store in DB
        await authRepository.storeRefreshToken(userId, tokenHash, expiresAt);

        return refreshToken;
    }

    async register(email: string, passwordRaw: string, name: string) {
        // 1. Check if user already exists
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            const error = new Error('Email already in use') as any;
            error.statusCode = 400;
            throw error;
        }

        // 2. Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(passwordRaw, saltRounds);

        // 3. Store user
        const newUser = await authRepository.createUser(email, passwordHash, name);

        // 4. Issue tokens
        const accessToken = this.generateAccessToken(newUser);
        const refreshToken = await this.generateRefreshToken(newUser.id);

        return {
            user: { id: newUser.id, email: newUser.email, name: newUser.name },
            accessToken,
            refreshToken
        };
    }

    async login(email: string, passwordRaw: string) {
        // 1. Verify email
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        // 2. Compare password
        const isPasswordValid = await bcrypt.compare(passwordRaw, user.password_hash);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials') as any;
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

    async refresh(refreshTokenRaw: string) {
        // 1. Hash the incoming token
        const tokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');

        // 2. Check DB for valid refresh token
        const tokenRecord = await authRepository.findRefreshToken(tokenHash);
        if (!tokenRecord) {
            const error = new Error('Invalid or expired refresh token') as any;
            error.statusCode = 401;
            throw error;
        }

        // Optional: We do not strictly need the full user record here, but we should fetch it to generate a new access token
        const dbPool = require('../../config/db').default;
        const [rows] = await dbPool.query('SELECT * FROM users WHERE id = ?', [tokenRecord.user_id]);

        const user = (rows as import('mysql2').RowDataPacket[])[0] as User;
        if (!user) {
            const error = new Error('User associated with token not found') as any;
            error.statusCode = 401;
            throw error;
        }

        // 3. Issue new access token
        const accessToken = this.generateAccessToken(user);

        // Note: We could implement refresh token rotation here, but keeping it simple for now based on requirements.
        return { accessToken };
    }

    async logout(refreshTokenRaw: string) {
        if (!refreshTokenRaw) return;

        // Hash the token and revoke it in the database
        const tokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
        await authRepository.revokeRefreshToken(tokenHash);
    }
}

export const authService = new AuthService();
