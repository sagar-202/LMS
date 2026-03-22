"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// POST /api/chatbot  —  requires a valid session
router.post('/', authHandler_1.protect, controller_1.chatbotController.chat);
exports.default = router;
//# sourceMappingURL=routes.js.map