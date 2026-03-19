import { Request, Response, NextFunction } from 'express';
export declare class SubjectsController {
    /**
     * GET /api/subjects
     * Retrieves a list of all published subjects
     */
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /api/subjects/:subjectId
     * Retrieves details for a specific subject
     */
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/subjects/:subjectId/tree
     * Retrieves the fully nested structure for a specific subject
     */
    getTree: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/subjects/:subjectId/first-video
     * Determines the smartest video to start/resume for the user
     */
    getSmartResume: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const subjectsController: SubjectsController;
//# sourceMappingURL=controller.d.ts.map