import { Router } from 'express';
import { progressController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// Secure all progress routes
router.use(protect as any);

// Define routes
router.get('/videos/:videoId', progressController.getVideoProgress);
router.post('/videos/:videoId', progressController.updateVideoProgress);
router.get('/subjects/:subjectId', progressController.getSubjectProgress);
router.get('/stats', progressController.getOverallStats);
router.get('/last-watched', progressController.getLastWatched);

export default router;
