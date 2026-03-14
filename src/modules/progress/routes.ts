import { Router } from 'express';
import { progressController } from './controller';

const router = Router();

// Define routes
router.get('/videos/:videoId', progressController.getVideoProgress);
router.post('/videos/:videoId', progressController.updateVideoProgress);
router.get('/subjects/:subjectId', progressController.getSubjectProgress);

export default router;
