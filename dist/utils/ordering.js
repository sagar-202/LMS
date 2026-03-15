"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVideoNavigation = void 0;
/**
 * Calculates the next and previous video given a flat array of all videos within a subject.
 *
 * @param allSubjectVideos Flat array of all videos in the subject, containing their section order and video order.
 * @param currentVideoId The video ID being viewed currently.
 * @returns An object containing previous_video_id and next_video_id.
 */
const calculateVideoNavigation = (allSubjectVideos, currentVideoId) => {
    // Sort the entire list globally based on Section Order, then Video Order
    const sorted = [...allSubjectVideos].sort((a, b) => {
        if (a.section_order !== b.section_order) {
            return a.section_order - b.section_order;
        }
        return a.video_order - b.video_order;
    });
    const currentIndex = sorted.findIndex(v => v.id === currentVideoId);
    // If video is not found in the subject's tree (should not happen), return nulls safely
    if (currentIndex === -1) {
        return { previous_video_id: null, next_video_id: null };
    }
    const previous_video_id = currentIndex > 0 ? sorted[currentIndex - 1]?.id ?? null : null;
    const next_video_id = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]?.id ?? null : null;
    return { previous_video_id, next_video_id };
};
exports.calculateVideoNavigation = calculateVideoNavigation;
//# sourceMappingURL=ordering.js.map