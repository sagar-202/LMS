import db from '../../config/db';
import { RowDataPacket } from 'mysql2/promise';

export interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Section {
    id: number;
    subject_id: number;
    title: string;
    order_index: number;
}

export interface Video {
    id: number;
    section_id: number;
    title: string;
    description: string;
    youtube_video_id: string;
    order_index: number;
    duration_seconds: number;
}

export class SubjectsRepository {
    async getPublishedSubjects(): Promise<Subject[]> {
        const query = 'SELECT * FROM subjects WHERE is_published = TRUE ORDER BY created_at DESC';
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as Subject[];
    }

    async getPublishedSubjectById(subjectId: number): Promise<Subject | null> {
        const query = 'SELECT * FROM subjects WHERE id = ? AND is_published = TRUE LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [subjectId]);
        if (rows.length === 0) return null;
        return rows[0] as Subject;
    }

    async getSectionsBySubjectId(subjectId: number): Promise<Section[]> {
        const query = 'SELECT id, subject_id, title, order_index FROM sections WHERE subject_id = ? ORDER BY order_index ASC';
        const [rows] = await db.query<RowDataPacket[]>(query, [subjectId]);
        return rows as Section[];
    }

    async getVideosBySectionIds(sectionIds: number[]): Promise<Video[]> {
        if (sectionIds.length === 0) return [];

        // Create placeholders for the IN clause (?, ?, ?)
        const placeholders = sectionIds.map(() => '?').join(',');
        const query = `
      SELECT id, section_id, title, description, youtube_video_id, order_index, duration_seconds 
      FROM videos 
      WHERE section_id IN (${placeholders}) 
      ORDER BY section_id ASC, order_index ASC
    `;

        const [rows] = await db.query<RowDataPacket[]>(query, sectionIds);
        return rows as Video[];
    }
}

export const subjectsRepository = new SubjectsRepository();
