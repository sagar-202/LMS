export interface VideoRecord {
    id: number;
    section_id: number;
    section_title: string;
    subject_id: number;
    subject_title: string;
    title: string;
    description: string;
    youtube_video_id: string;
    order_index: number;
    duration_seconds: number;
    created_at: Date;
    updated_at: Date;
}
export declare class VideosRepository {
    /**
     * Fetch a single video by its ID with section and subject context
     */
    getVideoById(videoId: number): Promise<VideoRecord | null>;
    /**
     * Fetch all videos belonging to a specific subject, joined with section orders.
     * This retrieves the flattened dataset needed to compute global ordering.
     */
    getAllVideosBySubject(subjectId: number): Promise<{
        id: number;
        section_id: number;
        section_order: number;
        video_order: number;
    }[]>;
    /**
     * Utility to find which subject a video belongs to, by traversing up the Section.
     */
    getSubjectIdForVideo(videoId: number): Promise<number | null>;
}
export declare const videosRepository: VideosRepository;
//# sourceMappingURL=repository.d.ts.map