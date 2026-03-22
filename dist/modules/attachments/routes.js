"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// List attachments for a specific lesson (accessible to students)
// Moved to videosRoutes as /api/videos/:id/attachments for absolute pathing consistency
// Add a new attachment (instructor/admin only)
router.post('/attachments', authHandler_1.protect, (0, authHandler_1.authorizeRoles)('instructor', 'admin'), controller_1.attachmentsController.addAttachment);
exports.default = router;
//# sourceMappingURL=routes.js.map