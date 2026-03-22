import { Router } from 'express';
import { chatbotController } from './controller';

const router = Router();

// POST /api/chatbot
// No auth guard needed — HF_API_KEY is server-side only, never exposed to clients.
// Rate limiting can be added here in future if needed.
router.post('/', chatbotController.chat);

export default router;
