"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRepository = exports.ProgressRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ProgressRepository {
    /**
     * Retrieves specific progress on a specific video for a specific user
     */
    async getVideoProgress(userId, videoId) {
        const query = 'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ? LIMIT 1';
        const [rows] = await db_1.default.query(query, [userId, videoId]);
        if (!rows || rows.length === 0)
            return null;
        return rows[0];
    }
    /**
     * Upserts the progress. Uses MySQL ON DUPLICATE KEY UPDATE.
     */
    async upsertVideoProgress(userId, videoId, lastPositionSeconds, isCompleted) {
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
        await db_1.default.query(query, [userId, videoId, lastPositionSeconds, isCompleted, completedAt]);
    }
    /**
     * Complex query to compute overall subject progress dynamically for a specific user.
     */
    async getSubjectProgressStats(userId, subjectId) {
        // Query to get totals and the "furthest reached" video progress
        const query = `
            SELECT 
                COUNT(v.id) as total_videos,
                SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) as completed_videos,
                
                -- Furthest Reached: The video in this subject with progress that has the highest order sequence
                (
                    SELECT vp2.video_id 
                    FROM video_progress vp2
                    JOIN videos v2 ON vp2.video_id = v2.id
                    JOIN sections s2 ON v2.section_id = s2.id
                    WHERE vp2.user_id = ? AND s2.subject_id = ?
                    ORDER BY s2.order_index DESC, v2.order_index DESC
                    LIMIT 1
                ) as last_video_id,
                
                (
                    SELECT vp3.last_position_seconds 
                    FROM video_progress vp3
                    JOIN videos v3 ON vp3.video_id = v3.id
                    JOIN sections s3 ON v3.section_id = s3.id
                    WHERE vp3.user_id = ? AND s3.subject_id = ?
                    ORDER BY s3.order_index DESC, v3.order_index DESC
                    LIMIT 1
                ) as last_position_seconds

            FROM videos v
            JOIN sections s ON v.section_id = s.id
            LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = ?
            WHERE s.subject_id = ?
        `;
        const [rows] = await db_1.default.query(query, [userId, subjectId, userId, subjectId, userId, subjectId]);
        if (!rows || rows.length === 0)
            return null;
        return rows[0] ?? null;
    }
    async getLastWatchedVideoInSubject(userId, subjectId) {
        const query = `
            SELECT vp.video_id
            FROM video_progress vp
            JOIN videos v ON vp.video_id = v.id
            JOIN sections s ON v.section_id = s.id
            WHERE vp.user_id = ? AND s.subject_id = ?
            ORDER BY vp.updated_at DESC
            LIMIT 1
        `;
        const [rows] = await db_1.default.query(query, [userId, subjectId]);
        const firstRow = rows[0];
        if (!firstRow)
            return null;
        return firstRow.video_id;
    }
    async getLastWatchedProgress(userId) {
        const query = `
            SELECT 
                s.id as subject_id,
                s.title as subject_title,
                v.id as video_id,
                v.title as video_title,
                v.youtube_video_id,
                (
                    SELECT COUNT(*) 
                    FROM videos v2
                    JOIN sections sec2 ON v2.section_id = sec2.id
                    WHERE sec2.subject_id = s.id 
                    AND (sec2.order_index < sec.order_index OR (sec2.order_index = sec.order_index AND v2.order_index <= v.order_index))
                ) as lesson_number,
                (
                    SELECT COUNT(*)
                    FROM videos v3
                    JOIN sections sec3 ON v3.section_id = sec3.id
                    WHERE sec3.subject_id = s.id
                ) as total_lessons
            FROM video_progress vp
            JOIN videos v ON vp.video_id = v.id
            JOIN sections sec ON v.section_id = sec.id
            JOIN subjects s ON sec.subject_id = s.id
            WHERE vp.user_id = ?
            ORDER BY vp.updated_at DESC
            LIMIT 1
        `;
        const [rows] = await db_1.default.query(query, [userId]);
        if (!rows || rows.length === 0)
            return null;
        return rows[0] ?? null;
    }
    async getOverallProgressStats(userId) {
        const query = `
            SELECT 
                (
                    SELECT COUNT(*)
                    FROM video_progress vp
                    JOIN videos v ON vp.video_id = v.id
                    JOIN sections s ON v.section_id = s.id
                    WHERE vp.user_id = ? AND vp.is_completed = 1
                    AND s.subject_id IN (SELECT subject_id FROM enrollments WHERE user_id = ?)
                ) as completed_lessons,
                (
                    SELECT COUNT(*)
                    FROM videos v
                    JOIN sections s ON v.section_id = s.id
                    WHERE s.subject_id IN (SELECT subject_id FROM enrollments WHERE user_id = ?)
                ) as total_lessons
        `;
        const [rows] = await db_1.default.query(query, [userId, userId, userId]);
        return {
            completed_lessons: rows[0]?.completed_lessons || 0,
            total_lessons: rows[0]?.total_lessons || 0
        };
    }
}
exports.ProgressRepository = ProgressRepository;
exports.progressRepository = new ProgressRepository();
//# sourceMappingURL=repository.js.map