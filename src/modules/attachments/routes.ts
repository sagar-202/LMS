import { Router } from 'express';
import { attachmentsController } from './controller';
import { protect, authorizeRoles } from '../../middleware/authHandler';

const router = Router();

// List attachments for a specific lesson (accessible to students)
router.get('/videos/:id/attachments', protect as any, attachmentsController.getLessonAttachments as any);

// Add a new attachment (instructor/admin only)
router.post('/attachments', 
    protect as any, 
    authorizeRoles('instructor', 'admin') as any, 
    attachmentsController.addAttachment as any
);

export default router;
