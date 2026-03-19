"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Secure all certificate routes
router.use(authHandler_1.protect);
// Define routes
router.post('/generate/:subjectId', controller_1.certificatesController.generate);
router.get('/my', controller_1.certificatesController.getMyCertificates);
exports.default = router;
//# sourceMappingURL=routes.js.map