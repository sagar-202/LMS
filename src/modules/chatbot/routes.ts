import { Router } from 'express';
import { chatbotController } from './controller';
import { protect } from '../../middleware/authHandler';

const router = Router();

// POST /api/chatbot  —  requires a valid session
router.post('/', protect, chatbotController.chat);

export default router;
