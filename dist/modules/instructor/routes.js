"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Protect all instructor routes
router.use(authHandler_1.protect);
router.use((0, authHandler_1.authorizeRoles)('instructor', 'admin'));
// Define routes
router.post('/courses', controller_1.instructorController.createCourse);
router.post('/lessons', controller_1.instructorController.addLesson);
router.get('/dashboard', controller_1.instructorController.getDashboard);
exports.default = router;
//# sourceMappingURL=routes.js.map