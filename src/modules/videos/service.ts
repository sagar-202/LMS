import { videosRepository } from './repository';
import { calculateVideoNavigation, OrderedVideo } from '../../utils/ordering';
import { progressService } from '../progress/service';

export class VideosService {
    /**
     * Fetch a single video by ID, along with dynamically resolved next & previous links
     * structured flatly. Also evaluates unlock conditions based on user progress.
     */
    async getVideoWithNavigation(videoId: number, userId: number) {
        // 1. Fetch the core video
        const video = await videosRepository.getVideoById(videoId);
        if (!video) {
            throw { statusCode: 404, message: 'Video not found' };
        }

        // 2. Discover which subject this video belongs to
        const subjectId = await videosRepository.getSubjectIdForVideo(videoId);
        if (!subjectId) {
            throw { statusCode: 404, message: 'Subject linkage missing. Video is orphaned.' };
        }

        // 3. Fetch flat ordered context for this subject
        const subjectVideoContext = await videosRepository.getAllVideosBySubject(subjectId);

        // Convert DB output safely
        const allOrderedVideos: OrderedVideo[] = subjectVideoContext.map(v => ({
            id: v.id,
            section_id: v.section_id,
            section_order: v.section_order,
            video_order: v.video_order
        }));

        // 4. Calculate relative neighbors
        const { next_video_id, previous_video_id } = calculateVideoNavigation(allOrderedVideos, videoId);

        // 5. Check Prerequisite logic
        // A video is only unlocked if the previous_video_id is completed (or if it's the very first video, i.e., previous=null)
        let is_locked = false;
        if (previous_video_id !== null) {
            const previousProgress = await progressService.getVideoProgress(userId, previous_video_id);
            if (!previousProgress.is_completed) {
                is_locked = true;
            }
        }

        // Fetch progress for *this* video
        const currentProgress = await progressService.getVideoProgress(userId, videoId);

        // 6. Build and return precisely what the client needs
        return {
            id: video.id,
            title: video.title,
            description: video.description,
            youtube_video_id: video.youtube_video_id,
            order_index: video.order_index,
            duration_seconds: video.duration_seconds,
            section_id: video.section_id,
            section_title: video.section_title,
            subject_id: video.subject_id,
            subject_title: video.subject_title,
            previous_video_id,
            next_video_id,
            is_completed: currentProgress.is_completed,
            locked: is_locked,
            unlock_reason: is_locked ? 'Complete the previous lesson to unlock this one' : null
        };
    }
}

export const videosService = new VideosService();
