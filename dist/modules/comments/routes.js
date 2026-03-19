"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Get comments for a lesson (recursive tree)
router.get('/:lessonId', authHandler_1.protect, controller_1.commentsController.getLessonComments);
// Add a comment or reply
router.post('/', authHandler_1.protect, controller_1.commentsController.addComment);
exports.default = router;
//# sourceMappingURL=routes.js.map