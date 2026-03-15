import { Router } from 'express';
import { subjectsController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// Define routes
router.get('/', subjectsController.getAll);
router.get('/:subjectId', subjectsController.getById);
router.get('/:subjectId/tree', subjectsController.getTree);
router.get('/:subjectId/first-video', protect, subjectsController.getSmartResume);

export default router;
