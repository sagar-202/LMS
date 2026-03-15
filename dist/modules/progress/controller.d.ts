import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class ProgressController {
    /**
     * GET /api/progress/videos/:videoId
     * Get progress for a specific video
     */
    getVideoProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/progress/videos/:videoId
     * Upsert progress for a specific video
     */
    updateVideoProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/progress/subjects/:subjectId
     * Get aggregated progress statistics for a subject
     */
    getSubjectProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/progress/last-watched
     * Get the most recently watched video progress
     */
    getLastWatched: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/progress/stats
     * Get overall progress stats for the user
     */
    getOverallStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const progressController: ProgressController;
//# sourceMappingURL=controller.d.ts.map