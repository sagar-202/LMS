import { RowDataPacket } from 'mysql2/promise';
export interface VideoProgress {
    user_id: number;
    video_id: number;
    last_position_seconds: number;
    is_completed: boolean;
    completed_at: Date | null;
}
export declare class ProgressRepository {
    /**
     * Retrieves specific progress on a specific video for a specific user
     */
    getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | null>;
    /**
     * Upserts the progress. Uses MySQL ON DUPLICATE KEY UPDATE.
     */
    upsertVideoProgress(userId: number, videoId: number, lastPositionSeconds: number, isCompleted: boolean): Promise<void>;
    /**
     * Complex query to compute overall subject progress dynamically for a specific user.
     */
    getSubjectProgressStats(userId: number, subjectId: number): Promise<RowDataPacket | null>;
    getLastWatchedVideoInSubject(userId: number, subjectId: number): Promise<number | null>;
    getLastWatchedProgress(userId: number): Promise<RowDataPacket | null>;
    getOverallProgressStats(userId: number): Promise<{
        completed_lessons: number;
        total_lessons: number;
    }>;
}
export declare const progressRepository: ProgressRepository;
//# sourceMappingURL=repository.d.ts.map