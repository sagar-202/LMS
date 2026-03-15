import { Request, Response, NextFunction } from 'express';
import { subjectsService } from './service';

export class SubjectsController {

    /**
     * GET /api/subjects
     * Retrieves a list of all published subjects
     */
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjects = await subjectsService.getAllPublishedSubjects();
            res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/subjects/:subjectId
     * Retrieves details for a specific subject
     */
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subjectId = parseInt(req.params.subjectId as string, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const subject = await subjectsService.getSubjectById(subjectId);
            res.status(200).json({
                success: true,
                data: subject
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/subjects/:subjectId/tree
     * Retrieves the fully nested structure for a specific subject
     */
    getTree = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt((req.header('X-User-Id') as string) || '1', 10);
            const subjectId = parseInt(req.params.subjectId as string, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const tree = await subjectsService.getSubjectTree(subjectId, userId);
            res.status(200).json({
                success: true,
                data: tree
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/subjects/:subjectId/first-video
     * Determines the smartest video to start/resume for the user
     */
    getSmartResume = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const subjectId = parseInt(req.params.subjectId as string, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const videoId = await subjectsService.getSmartResumeVideo(subjectId, userId);
            if (!videoId) {
                return res.status(404).json({ message: 'No videos found for this subject' });
            }

            res.status(200).json({
                success: true,
                data: { video_id: videoId }
            });
        } catch (error) {
            next(error);
        }
    };
}

export const subjectsController = new SubjectsController();
