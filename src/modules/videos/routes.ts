import { Router } from 'express';
import { videosController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// Define routes
router.get('/:videoId', protect as any, videosController.getVideo);

export default router;
