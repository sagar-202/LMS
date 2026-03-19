import { Router } from 'express';
import { quizzesController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// Secure all quiz routes
router.use(protect as any);

// Define routes
router.get('/:lessonId', quizzesController.getQuizByLessonId as any);
router.post('/submit', quizzesController.submitQuiz as any);

export default router;
