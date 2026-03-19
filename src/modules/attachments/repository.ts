import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface LessonAttachment {
    id: number;
    lesson_id: number;
    file_url: string;
    file_type: 'pdf' | 'zip' | 'doc' | 'docx' | 'other';
    created_at: Date;
}

export class AttachmentsRepository {
    async create(lessonId: number, fileUrl: string, fileType: string): Promise<LessonAttachment> {
        const query = 'INSERT INTO lesson_attachments (lesson_id, file_url, file_type) VALUES (?, ?, ?)';
        const [result] = await db.query<ResultSetHeader>(query, [lessonId, fileUrl, fileType]);
        
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM lesson_attachments WHERE id = ?', [result.insertId]);
        return rows[0] as LessonAttachment;
    }

    async getByLessonId(lessonId: number): Promise<LessonAttachment[]> {
        const query = 'SELECT * FROM lesson_attachments WHERE lesson_id = ? ORDER BY created_at DESC';
        const [rows] = await db.query<RowDataPacket[]>(query, [lessonId]);
        return rows as LessonAttachment[];
    }
}

export const attachmentsRepository = new AttachmentsRepository();
