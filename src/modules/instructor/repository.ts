import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Subject, Section, Video } from '../subjects/repository';

export class InstructorRepository {
    async createSubject(data: Partial<Subject>): Promise<number> {
        const query = `
            INSERT INTO subjects (title, slug, description, difficulty, category, is_published) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query<ResultSetHeader>(query, [
            data.title, data.slug, data.description, data.difficulty, data.category, data.is_published ?? true
        ]);
        return result.insertId;
    }

    async addInstructorToCourse(subjectId: number, userId: number): Promise<void> {
        const query = 'INSERT INTO course_instructors (subject_id, user_id) VALUES (?, ?)';
        await db.query(query, [subjectId, userId]);
    }

    async getSubjectsByInstructor(userId: number): Promise<Subject[]> {
        const query = `
            SELECT s.* 
            FROM subjects s
            JOIN course_instructors ci ON s.id = ci.subject_id
            WHERE ci.user_id = ?
            ORDER BY s.created_at DESC
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [userId]);
        return rows as Subject[];
    }

    async createSection(subjectId: number, title: string, orderIndex: number): Promise<number> {
        const query = 'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)';
        const [result] = await db.query<ResultSetHeader>(query, [subjectId, title, orderIndex]);
        return result.insertId;
    }

    async createVideo(sectionId: number, data: Partial<Video>): Promise<number> {
        const query = `
            INSERT INTO videos (section_id, title, youtube_video_id, order_index, description, duration_seconds) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query<ResultSetHeader>(query, [
            sectionId, data.title, data.youtube_video_id, data.order_index, data.description, data.duration_seconds ?? 0
        ]);
        return result.insertId;
    }

    async isInstructorOfCourse(userId: number, subjectId: number): Promise<boolean> {
        const query = 'SELECT 1 FROM course_instructors WHERE user_id = ? AND subject_id = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [userId, subjectId]);
        return rows.length > 0;
    }
}

export const instructorRepository = new InstructorRepository();
