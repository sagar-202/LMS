import { Router } from 'express';
import { enrollmentController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// All enrollment routes require authentication
router.use(protect);

// Simplified routes to be relative to mount points
router.post('/:subjectId', enrollmentController.enroll);
router.get('/', enrollmentController.getEnrollments);

export default router;
