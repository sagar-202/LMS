export interface OrderedVideo {
    id: number;
    section_id: number;
    section_order: number;
    video_order: number;
}
export interface NavigationResult {
    previous_video_id: number | null;
    next_video_id: number | null;
}
/**
 * Calculates the next and previous video given a flat array of all videos within a subject.
 *
 * @param allSubjectVideos Flat array of all videos in the subject, containing their section order and video order.
 * @param currentVideoId The video ID being viewed currently.
 * @returns An object containing previous_video_id and next_video_id.
 */
export declare const calculateVideoNavigation: (allSubjectVideos: OrderedVideo[], currentVideoId: number) => NavigationResult;
//# sourceMappingURL=ordering.d.ts.map