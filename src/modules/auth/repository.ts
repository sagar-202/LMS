import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { User } from '../users/repository';

export class AuthRepository {
    async createUser(email: string, passwordHash: string, name: string, role: string = 'student'): Promise<User> {
        const query = 'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query<ResultSetHeader>(query, [email, passwordHash, name, role]);

        // Fetch and return the newly created user
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return rows[0] as User;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [email]);
        if (rows.length === 0) return null;
        return rows[0] as User;
    }

    async storeRefreshToken(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
        const query = 'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)';
        await db.query(query, [userId, tokenHash, expiresAt]);
    }

    async findRefreshToken(tokenHash: string): Promise<RowDataPacket | null> {
        const query = 'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [tokenHash]);
        if (rows.length === 0) return null;
        return rows[0] || null;
    }

    async revokeRefreshToken(tokenHash: string): Promise<void> {
        const query = 'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL';
        await db.query(query, [tokenHash]);
    }
}

export const authRepository = new AuthRepository();
