import { Router } from 'express';
import { subjectsController } from './controller';
import { protect, authorizeRoles } from '../../middleware/authHandler';

const router = Router();

// Define routes
router.get('/', subjectsController.getAll);
router.get('/:subjectId', subjectsController.getById);
router.get('/:subjectId/tree', subjectsController.getTree);
router.get('/:subjectId/first-video', protect, subjectsController.getSmartResume);

// RBAC Protected Routes
router.post('/', protect as any, authorizeRoles('instructor', 'admin') as any, (req, res) => {
    res.status(201).json({ message: 'Course creation initialized (Instructor/Admin only)' });
});

router.post('/:subjectId/lessons', protect as any, authorizeRoles('instructor', 'admin') as any, (req, res) => {
    res.status(201).json({ message: 'Lesson upload initialized (Instructor/Admin only)' });
});

export default router;
