import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
import { attachmentsService } from './service';

export class AttachmentsController {
    addAttachment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const { lessonId, fileUrl, fileType } = req.body;
            
            if (!userId) return res.status(401).json({ message: 'Not authenticated' });

            const attachment = await attachmentsService.addAttachment(
                userId, 
                parseInt(lessonId), 
                fileUrl, 
                fileType
            );
            
            res.status(201).json({
                success: true,
                data: attachment
            });
        } catch (error) {
            next(error);
        }
    };

    getLessonAttachments = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const attachments = await attachmentsService.getLessonAttachments(parseInt(id as string));
            
            res.status(200).json({
                success: true,
                data: attachments
            });
        } catch (error) {
            next(error);
        }
    };
}

export const attachmentsController = new AttachmentsController();
