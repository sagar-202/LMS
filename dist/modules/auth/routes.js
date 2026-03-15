"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/register', controller_1.authController.register);
router.post('/login', controller_1.authController.login);
router.post('/refresh', controller_1.authController.refresh);
router.post('/logout', controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=routes.js.map