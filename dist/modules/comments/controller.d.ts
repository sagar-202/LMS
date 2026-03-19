import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class CommentsController {
    addComment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getLessonComments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
export declare const commentsController: CommentsController;
//# sourceMappingURL=controller.d.ts.map