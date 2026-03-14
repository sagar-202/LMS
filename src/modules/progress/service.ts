import { progressRepository } from './repository';
import { videosRepository } from '../videos/repository';

export class ProgressService {
    async getVideoProgress(userId: number, videoId: number) {
        const progress = await progressRepository.getVideoProgress(userId, videoId);
        if (!progress) {
            return { last_position_seconds: 0, is_completed: false };
        }

        return {
            last_position_seconds: progress.last_position_seconds,
            is_completed: progress.is_completed
        };
    }

    async updateVideoProgress(
        userId: number,
        videoId: number,
        rawPosition: number,
        isCompleted: boolean
    ) {
        // 1. Validate video exists and check bounds
        const video = await videosRepository.getVideoById(videoId);
        if (!video) {
            throw { statusCode: 404, message: 'Video not found' };
        }

        // 2. Cap the seconds
        let finalPosition = rawPosition < 0 ? 0 : rawPosition;

        // Only cap by duration if duration > 0 (prevents 0 duration locks)
        if (video.duration_seconds > 0 && finalPosition > video.duration_seconds) {
            finalPosition = video.duration_seconds;
        }

        // 3. Upsert
        await progressRepository.upsertVideoProgress(userId, videoId, finalPosition, isCompleted);

        return { last_position_seconds: finalPosition, is_completed: isCompleted };
    }

    async getSubjectProgress(userId: number, subjectId: number) {
        const stats = await progressRepository.getSubjectProgressStats(userId, subjectId);

        if (!stats || stats.total_videos === 0) {
            return {
                total_videos: 0,
                completed_videos: 0,
                percent_complete: 0,
                last_video_id: null,
                last_position_seconds: 0
            };
        }

        const total = Number(stats.total_videos) || 0;
        const completed = Number(stats.completed_videos) || 0;

        // Calculate percentage as rounded integer
        const percent = total > 0 ? Math.floor((completed / total) * 100) : 0;

        return {
            total_videos: total,
            completed_videos: completed,
            percent_complete: percent,
            last_video_id: stats.last_video_id || null,
            last_position_seconds: Number(stats.last_position_seconds) || 0
        };
    }
}

export const progressService = new ProgressService();
