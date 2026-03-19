import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class QuizzesController {
    getQuizByLessonId: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    submitQuiz: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const quizzesController: QuizzesController;
//# sourceMappingURL=controller.d.ts.map