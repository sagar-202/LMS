"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Define routes
router.get('/', controller_1.subjectsController.getAll);
router.get('/:subjectId', controller_1.subjectsController.getById);
router.get('/:subjectId/tree', controller_1.subjectsController.getTree);
router.get('/:subjectId/first-video', authHandler_1.protect, controller_1.subjectsController.getSmartResume);
exports.default = router;
//# sourceMappingURL=routes.js.map