import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface VideoProgress {
    user_id: number;
    video_id: number;
    last_position_seconds: number;
    is_completed: boolean;
    completed_at: Date | null;
}

export class ProgressRepository {
    /**
     * Retrieves specific progress on a specific video for a specific user
     */
    async getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | null> {
        const query = 'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [userId, videoId]);
        if (rows.length === 0) return null;
        return rows[0] as VideoProgress;
    }

    /**
     * Upserts the progress. Uses MySQL ON DUPLICATE KEY UPDATE.
     */
    async upsertVideoProgress(
        userId: number,
        videoId: number,
        lastPositionSeconds: number,
        isCompleted: boolean
    ): Promise<void> {
        const completedAt = isCompleted ? new Date() : null;

        // Convert boolean to 1/0 for MySQL if necessary, though mysql2 often handles native booleans.
        const query = `
      INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        last_position_seconds = VALUES(last_position_seconds),
        is_completed = VALUES(is_completed),
        completed_at = VALUES(completed_at)
    `;

        await db.query(query, [userId, videoId, lastPositionSeconds, isCompleted, completedAt]);
    }

    /**
     * Complex query to compute overall subject progress dynamically for a specific user.
     */
    async getSubjectProgressStats(userId: number, subjectId: number): Promise<RowDataPacket | null> {
        // 1. Get total video count for the subject
        // 2. Join with video_progress to see how many are completed
        // 3. Find latest interacted video/position
        const query = `
      SELECT
        COUNT(v.id) as total_videos,
        COALESCE(SUM(CASE WHEN vp.is_completed = TRUE THEN 1 ELSE 0 END), 0) as completed_videos,
        
        -- To find the very last video they touched, order by progress update time (or completed time)
        -- Since mysql doesn't have an easily extractable 'updated_at' on the junction naturally without schema tricks
        -- We will grab the MAX(vp.video_id) where last_position > 0 or similar simple heuristic. 
        -- Alternatively, order by sections/videos to find the furthest reached.
        MAX(CASE WHEN vp.last_position_seconds > 0 OR vp.is_completed = 1 THEN vp.video_id ELSE NULL END) as last_video_id,
        MAX(CASE WHEN vp.last_position_seconds > 0 OR vp.is_completed = 1 THEN vp.last_position_seconds ELSE 0 END) as last_position_seconds

      FROM videos v
      JOIN sections s ON v.section_id = s.id
      LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = ?
      WHERE s.subject_id = ?
    `;

        const [rows] = await db.query<RowDataPacket[]>(query, [userId, subjectId]);
        if (rows.length === 0) return null;
        return rows[0];
    }
}

export const progressRepository = new ProgressRepository();
