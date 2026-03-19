import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class InstructorController {
    createCourse: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    addLesson: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getDashboard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const instructorController: InstructorController;
//# sourceMappingURL=controller.d.ts.map