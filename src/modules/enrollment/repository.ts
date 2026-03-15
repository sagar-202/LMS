import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Enrollment {
    user_id: number;
    subject_id: number;
    enrolled_at: Date;
}

export class EnrollmentRepository {
    async enrollUser(userId: number, subjectId: number): Promise<void> {
        const query = 'INSERT IGNORE INTO enrollments (user_id, subject_id) VALUES (?, ?)';
        await db.query<ResultSetHeader>(query, [userId, subjectId]);
    }

    async getEnrollmentsByUserId(userId: number): Promise<number[]> {
        const query = 'SELECT subject_id FROM enrollments WHERE user_id = ?';
        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows.map(row => row.subject_id);
    }

    async isUserEnrolled(userId: number, subjectId: number): Promise<boolean> {
        const query = 'SELECT 1 FROM enrollments WHERE user_id = ? AND subject_id = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [userId, subjectId]);
        return rows.length > 0;
    }
}

export const enrollmentRepository = new EnrollmentRepository();
