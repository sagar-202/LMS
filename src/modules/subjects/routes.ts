import { Router } from 'express';
import { subjectsController } from './controller';

const router = Router();

// Define routes
router.get('/', subjectsController.getAll);
router.get('/:subjectId', subjectsController.getById);
router.get('/:subjectId/tree', subjectsController.getTree);

export default router;
