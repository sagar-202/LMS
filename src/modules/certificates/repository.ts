import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Certificate {
    id: number;
    user_id: number;
    subject_id: number;
    issued_at: Date;
    certificate_url: string;
    subject_title?: string; // Optinally joined
}

export class CertificatesRepository {
    async create(userId: number, subjectId: number, url: string): Promise<Certificate> {
        const query = 'INSERT INTO certificates (user_id, subject_id, certificate_url) VALUES (?, ?, ?)';
        const [result] = await db.query<ResultSetHeader>(query, [userId, subjectId, url]);
        
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
        return rows[0] as Certificate;
    }

    async findByUserAndSubject(userId: number, subjectId: number): Promise<Certificate | null> {
        const query = 'SELECT * FROM certificates WHERE user_id = ? AND subject_id = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [userId, subjectId]);
        if (rows.length === 0) return null;
        return rows[0] as Certificate;
    }

    async findByUserId(userId: number): Promise<Certificate[]> {
        const query = `
            SELECT c.*, s.title as subject_title 
            FROM certificates c
            JOIN subjects s ON c.subject_id = s.id
            WHERE c.user_id = ?
            ORDER BY c.issued_at DESC
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows as Certificate[];
    }
}

export const certificatesRepository = new CertificatesRepository();
