"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Secure all progress routes
router.use(authHandler_1.protect);
// Define routes
router.get('/videos/:videoId', controller_1.progressController.getVideoProgress);
router.post('/videos/:videoId', controller_1.progressController.updateVideoProgress);
router.get('/subjects/:subjectId', controller_1.progressController.getSubjectProgress);
router.get('/stats', controller_1.progressController.getOverallStats);
router.get('/last-watched', controller_1.progressController.getLastWatched);
exports.default = router;
//# sourceMappingURL=routes.js.map