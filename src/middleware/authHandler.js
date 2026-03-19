"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized, no token provided',
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized, token failed',
        });
    }
};
exports.protect = protect;
//# sourceMappingURL=authHandler.js.map