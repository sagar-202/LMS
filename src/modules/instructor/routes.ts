import { Router } from 'express';
import { instructorController } from './controller';
import { protect, authorizeRoles } from '../../middleware/authHandler';

const router = Router();

// Protect all instructor routes
router.use(protect as any);
router.use(authorizeRoles('instructor', 'admin') as any);

// Define routes
router.post('/courses', instructorController.createCourse as any);
router.post('/lessons', instructorController.addLesson as any);
router.get('/dashboard', instructorController.getDashboard as any);

export default router;
