"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const controller_2 = require("../attachments/controller");
const router = (0, express_1.Router)();
// Define routes
router.get('/:videoId', authHandler_1.protect, controller_1.videosController.getVideo);
// Lesson attachments (Notes)
router.get('/:id/attachments', authHandler_1.protect, controller_2.attachmentsController.getLessonAttachments);
exports.default = router;
//# sourceMappingURL=routes.js.map