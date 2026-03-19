import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Define the User interface based on the database schema
export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}

export class UserRepository {
    /**
     * Example: Find a user by their email
     */
    async findByEmail(email: string): Promise<User | null> {
        const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;

        // Using the exported db pool to query
        const [rows] = await db.query<RowDataPacket[]>(query, [email]);

        if (rows.length === 0) {
            return null;
        }

        return rows[0] as User;
    }

    /**
     * Example: Return all users
     */
    async findAll(): Promise<User[]> {
        const query = `SELECT * FROM users ORDER BY created_at DESC`;
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as User[];
    }
}

export const userRepository = new UserRepository();
