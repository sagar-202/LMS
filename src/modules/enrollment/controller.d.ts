import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class EnrollmentController {
    enroll(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getEnrollments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const enrollmentController: EnrollmentController;
//# sourceMappingURL=controller.d.ts.map