"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authHandler_1 = require("../../middleware/authHandler");
const router = (0, express_1.Router)();
// Define routes
router.get('/:videoId', authHandler_1.protect, controller_1.videosController.getVideo);
exports.default = router;
//# sourceMappingURL=routes.js.map