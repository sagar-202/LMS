export declare class VideosService {
    /**
     * Fetch a single video by ID, along with dynamically resolved next & previous links
     * structured flatly. Also evaluates unlock conditions based on user progress.
     */
    getVideoWithNavigation(videoId: number, userId: number): Promise<{
        id: number;
        title: string;
        description: string;
        youtube_video_id: string;
        order_index: number;
        duration_seconds: number;
        section_id: number;
        section_title: string;
        subject_id: number;
        subject_title: string;
        previous_video_id: number | null;
        next_video_id: number | null;
        is_completed: boolean;
        locked: boolean;
        unlock_reason: string | null;
    }>;
}
export declare const videosService: VideosService;
//# sourceMappingURL=service.d.ts.map