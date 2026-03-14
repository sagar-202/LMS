import { Request, Response, NextFunction } from 'express';
import { progressService } from './service';

export class ProgressController {

    /**
     * GET /api/progress/videos/:videoId
     * Get progress for a specific video
     */
    getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // User ID would normally come from res.locals.user provided by an auth middleware.
            // Since auth middleware wasn't strictly built into the routes yet, hardcode a mock user for now
            // or assume it's passed via headers for the sake of the skeleton.
            const userId = parseInt(req.header('X-User-Id') || '1', 10);
            const videoId = parseInt(req.params.videoId, 10);

            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }

            const progress = await progressService.getVideoProgress(userId, videoId);
            res.status(200).json(progress);
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /api/progress/videos/:videoId
     * Upsert progress for a specific video
     */
    updateVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.header('X-User-Id') || '1', 10);
            const videoId = parseInt(req.params.videoId, 10);

            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }

            const last_position_seconds = parseInt(req.body.last_position_seconds, 10) || 0;
            const is_completed = req.body.is_completed === true;

            const progress = await progressService.updateVideoProgress(userId, videoId, last_position_seconds, is_completed);
            res.status(200).json(progress);
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/progress/subjects/:subjectId
     * Get aggregated progress statistics for a subject
     */
    getSubjectProgress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.header('X-User-Id') || '1', 10);
            const subjectId = parseInt(req.params.subjectId, 10);

            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const stats = await progressService.getSubjectProgress(userId, subjectId);
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    };
}

export const progressController = new ProgressController();
