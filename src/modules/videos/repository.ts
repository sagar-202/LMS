import db from '../../config/db';
import { RowDataPacket } from 'mysql2/promise';

export interface VideoRecord {
    id: number;
    section_id: number;
    title: string;
    description: string;
    youtube_video_id: string;
    order_index: number;
    duration_seconds: number;
    created_at: Date;
    updated_at: Date;
}

export class VideosRepository {
    /**
     * Fetch a single video by its ID
     */
    async getVideoById(videoId: number): Promise<VideoRecord | null> {
        const query = 'SELECT * FROM videos WHERE id = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [videoId]);
        if (!rows || rows.length === 0) return null;
        return rows[0] as VideoRecord;
    }

    /**
     * Fetch all videos belonging to a specific subject, joined with section orders.
     * This retrieves the flattened dataset needed to compute global ordering.
     */
    async getAllVideosBySubject(subjectId: number): Promise<{
        id: number,
        section_id: number,
        section_order: number,
        video_order: number
    }[]> {
        const query = `
      SELECT 
        v.id, 
        v.section_id, 
        s.order_index AS section_order, 
        v.order_index AS video_order
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
    `;
        const [rows] = await db.query<RowDataPacket[]>(query, [subjectId]);
        return rows as any; // Cast safely handled upstream
    }

    /**
     * Utility to find which subject a video belongs to, by traversing up the Section.
     */
    async getSubjectIdForVideo(videoId: number): Promise<number | null> {
        const query = `
      SELECT s.subject_id 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE v.id = ?
      LIMIT 1
    `;
        const [rows] = await db.query<RowDataPacket[]>(query, [videoId]);
        if (!rows || rows.length === 0) return null;
        return rows[0]?.subject_id ?? null;
    }
}

export const videosRepository = new VideosRepository();
