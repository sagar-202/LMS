import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface CommentRecord {
    id: number;
    lesson_id: number;
    user_id: number;
    user_name: string;
    user_role: string;
    content: string;
    parent_id: number | null;
    created_at: Date;
    updated_at: Date;
}

export class CommentsRepository {
    async create(data: { lesson_id: number, user_id: number, content: string, parent_id?: number | null }): Promise<number> {
        const query = `
            INSERT INTO comments (lesson_id, user_id, content, parent_id) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query<ResultSetHeader>(query, [
            data.lesson_id, data.user_id, data.content, data.parent_id ?? null
        ]);
        return result.insertId;
    }

    async getByLessonId(lessonId: number): Promise<CommentRecord[]> {
        const query = `
            SELECT 
                c.*, 
                u.name as user_name, 
                u.role as user_role
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.lesson_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [lessonId]);
        return rows as CommentRecord[];
    }

    async getById(commentId: number): Promise<CommentRecord | null> {
        const query = `
            SELECT 
                c.*, 
                u.name as user_name, 
                u.role as user_role
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [commentId]);
        if (!rows || rows.length === 0) return null;
        return rows[0] as CommentRecord;
    }
}

export const commentsRepository = new CommentsRepository();
