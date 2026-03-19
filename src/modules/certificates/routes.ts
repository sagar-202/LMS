import { Router } from 'express';
import { certificatesController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// Secure all certificate routes
router.use(protect as any);

// Define routes
router.post('/generate/:subjectId', certificatesController.generate as any);
router.get('/my', certificatesController.getMyCertificates as any);

export default router;
