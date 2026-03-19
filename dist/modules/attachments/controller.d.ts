import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class AttachmentsController {
    addAttachment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getLessonAttachments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
export declare const attachmentsController: AttachmentsController;
//# sourceMappingURL=controller.d.ts.map