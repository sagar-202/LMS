"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressService = exports.ProgressService = void 0;
const repository_1 = require("./repository");
const repository_2 = require("../videos/repository");
class ProgressService {
    async getVideoProgress(userId, videoId) {
        const progress = await repository_1.progressRepository.getVideoProgress(userId, videoId);
        if (!progress) {
            return { last_position_seconds: 0, is_completed: false };
        }
        return {
            last_position_seconds: progress.last_position_seconds,
            is_completed: progress.is_completed
        };
    }
    async updateVideoProgress(userId, videoId, rawPosition, isCompleted) {
        // 1. Validate video exists and check bounds
        const video = await repository_2.videosRepository.getVideoById(videoId);
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
        await repository_1.progressRepository.upsertVideoProgress(userId, videoId, finalPosition, isCompleted);
        return { last_position_seconds: finalPosition, is_completed: isCompleted };
    }
    async getSubjectProgress(userId, subjectId) {
        const stats = await repository_1.progressRepository.getSubjectProgressStats(userId, subjectId);
        if (!stats) {
            return {
                total_videos: 0,
                completed_videos: 0,
                percent_complete: 0,
                last_video_id: null,
                last_position_seconds: 0
            };
        }
        const total = stats.total_videos || 0;
        const completed = stats.completed_videos || 0;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
            total_videos: total,
            completed_videos: completed,
            percent_complete: percent,
            last_video_id: stats.last_video_id,
            last_position_seconds: stats.last_position_seconds
        };
    }
    async getOverallProgress(userId) {
        return await repository_1.progressRepository.getOverallProgressStats(userId);
    }
    async getLastWatched(userId) {
        return await repository_1.progressRepository.getLastWatchedProgress(userId);
    }
}
exports.ProgressService = ProgressService;
exports.progressService = new ProgressService();
//# sourceMappingURL=service.js.map