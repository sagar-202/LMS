import { Router } from 'express';
import { commentsController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// Get comments for a lesson (recursive tree)
router.get('/:lessonId', protect as any, commentsController.getLessonComments as any);

// Add a comment or reply
router.post('/', protect as any, commentsController.addComment as any);

export default router;
