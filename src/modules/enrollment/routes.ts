import { Router } from 'express';
import { enrollmentController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// All enrollment routes require authentication
router.use(protect);

router.post('/enroll/:subjectId', enrollmentController.enroll);
router.get('/enrollments', enrollmentController.getEnrollments);

export default router;
