"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Secure all quiz routes
router.use(authHandler_1.protect);
// Define routes
router.get('/:lessonId', controller_1.quizzesController.getQuizByLessonId);
router.post('/submit', controller_1.quizzesController.submitQuiz);
exports.default = router;
//# sourceMappingURL=routes.js.map