"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
// POST /api/chatbot
// No auth guard needed — HF_API_KEY is server-side only, never exposed to clients.
// Rate limiting can be added here in future if needed.
router.post('/', controller_1.chatbotController.chat);
exports.default = router;
//# sourceMappingURL=routes.js.map