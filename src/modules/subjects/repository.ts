import db from '../../config/db';
import { RowDataPacket } from 'mysql2/promise';

export interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: string;
    lessons_count: number;
    total_duration: number;
    is_published: boolean;
    first_video_id?: string;
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
        const query = `
            SELECT s.*, 
                (SELECT v.youtube_video_id 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id 
                 ORDER BY sec.order_index ASC, v.order_index ASC 
                 LIMIT 1) as first_video_id,
                (SELECT COUNT(*) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as lessons_count,
                (SELECT COALESCE(SUM(v.duration_seconds), 0) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as total_duration
            FROM subjects s 
            WHERE s.is_published = TRUE 
            ORDER BY s.created_at DESC
        `;
        const [rows] = await db.query<RowDataPacket[]>(query);
        return rows as Subject[];
    }

    async getPublishedSubjectById(subjectId: number): Promise<Subject | null> {
        const query = `
            SELECT s.*,
                (SELECT COUNT(*) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as lessons_count,
                (SELECT COALESCE(SUM(v.duration_seconds), 0) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as total_duration
            FROM subjects s 
            WHERE s.id = ? AND s.is_published = TRUE 
            LIMIT 1
        `;
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

    async getFirstVideoOfSubject(subjectId: number): Promise<Video | null> {
        const query = `
      SELECT v.* 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index ASC, v.order_index ASC
      LIMIT 1
    `;
        const [rows] = await db.query<RowDataPacket[]>(query, [subjectId]);
        if (rows.length === 0) return null;
        return rows[0] as Video;
    }
}

export const subjectsRepository = new SubjectsRepository();
