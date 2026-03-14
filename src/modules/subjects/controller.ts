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
            res.status(200).json(subjects);
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
            const subjectId = parseInt(req.params.subjectId, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const subject = await subjectsService.getSubjectById(subjectId);
            res.status(200).json(subject);
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
            const subjectId = parseInt(req.params.subjectId, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }

            const tree = await subjectsService.getSubjectTree(subjectId);
            res.status(200).json(tree);
        } catch (error) {
            next(error);
        }
    };
}

export const subjectsController = new SubjectsController();
