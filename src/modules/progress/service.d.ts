export declare class ProgressService {
    getVideoProgress(userId: number, videoId: number): Promise<{
        last_position_seconds: number;
        is_completed: boolean;
    }>;
    updateVideoProgress(userId: number, videoId: number, rawPosition: number, isCompleted: boolean): Promise<{
        last_position_seconds: number;
        is_completed: boolean;
    }>;
    getSubjectProgress(userId: number, subjectId: number): Promise<{
        total_videos: any;
        completed_videos: any;
        percent_complete: number;
        last_video_id: any;
        last_position_seconds: any;
    }>;
    getOverallProgress(userId: number): Promise<{
        completed_lessons: number;
        total_lessons: number;
    }>;
    getLastWatched(userId: number): Promise<import("mysql2").RowDataPacket | null>;
}
export declare const progressService: ProgressService;
//# sourceMappingURL=service.d.ts.map