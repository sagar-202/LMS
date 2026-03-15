"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// All enrollment routes require authentication
router.use(authHandler_1.protect);
router.post('/enroll/:subjectId', controller_1.enrollmentController.enroll);
router.get('/enrollments', controller_1.enrollmentController.getEnrollments);
exports.default = router;
//# sourceMappingURL=routes.js.map