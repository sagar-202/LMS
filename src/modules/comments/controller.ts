import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
import { commentsService } from './service';

export class CommentsController {
    addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const { lessonId, content, parentId } = req.body;
            
            if (!userId) return res.status(401).json({ message: 'Not authenticated' });

            const comment = await commentsService.addComment({
                lesson_id: parseInt(lessonId),
                user_id: userId,
                content,
                parent_id: parentId ? parseInt(parentId) : null
            });
            
            res.status(201).json({
                success: true,
                data: comment
            });
        } catch (error) {
            next(error);
        }
    };

    getLessonComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { lessonId } = req.params;
            const comments = await commentsService.getLessonCommentsTree(parseInt(lessonId as string));
            
            res.status(200).json({
                success: true,
                data: comments
            });
        } catch (error) {
            next(error);
        }
    };
}

export const commentsController = new CommentsController();
