import { Router } from 'express';
import { subjectsController } from './controller';
import { protect, authorizeRoles } from '../../middleware/authHandler';

const router = Router();

// Define routes
router.get('/', subjectsController.getAll);
router.get('/:subjectId', subjectsController.getById);
router.get('/:subjectId/tree', subjectsController.getTree);
router.get('/:subjectId/first-video', protect, subjectsController.getSmartResume);

// All public subject routes go here.
// Instructor management is handled in src/modules/instructor/routes.ts

export default router;
