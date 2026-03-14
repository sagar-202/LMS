import { Router } from 'express';
import { videosController } from './controller';

const router = Router();

// Define routes
router.get('/:videoId', videosController.getVideo);

export default router;
