import { Request, Response, NextFunction } from 'express';
import { progressService } from './service';
import { AuthRequest } from '../../middleware/authHandler';

export class ProgressController {

    /**
     * GET /api/progress/videos/:videoId
     * Get progress for a specific video
     */
    getVideoProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const videoId = parseInt(req.params.videoId as string, 10);
            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }

            const progress = await progressService.getVideoProgress(userId, videoId);
            res.status(200).json({
                success: true,
                data: progress
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /api/progress/videos/:videoId
     * Upsert progress for a specific video
     */
    updateVideoProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const videoId = parseInt(req.params.videoId as string, 10);
            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }

            const last_position_seconds = parseInt(req.body.last_position_seconds, 10) || 0;
            const is_completed = req.body.is_completed === true;

            const progress = await progressService.updateVideoProgress(userId, videoId, last_position_seconds, is_completed);
            res.status(200).json({
                success: true,
                data: progress
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/progress/subjects/:subjectId
     * Get aggregated progress statistics for a subject
     */
    getSubjectProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const subjectId = parseInt(req.params.subjectId as string, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const stats = await progressService.getSubjectProgress(userId, subjectId);
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/progress/last-watched
     * Get the most recently watched video progress
     */
    getLastWatched = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const lastWatched = await progressService.getLastWatched(userId);
            res.status(200).json({
                success: true,
                data: lastWatched
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/progress/stats
     * Get overall progress stats for the user
     */
    getOverallStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const stats = await progressService.getOverallProgress(userId);
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    };
}

export const progressController = new ProgressController();
