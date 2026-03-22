import { Router } from 'express';
import { videosController } from './controller';
import { protect } from '../../middleware/authHandler';
import { attachmentsController } from '../attachments/controller';

const router = Router();

// Define routes
router.get('/:videoId', protect as any, videosController.getVideo);

// Lesson attachments (Notes)
router.get('/:id/attachments', protect as any, attachmentsController.getLessonAttachments as any);

export default router;
