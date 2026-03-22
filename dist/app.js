"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./modules/auth/routes"));
const routes_2 = __importDefault(require("./modules/subjects/routes"));
const routes_3 = __importDefault(require("./modules/videos/routes"));
const routes_4 = __importDefault(require("./modules/progress/routes"));
const routes_5 = __importDefault(require("./modules/enrollment/routes"));
const routes_6 = __importDefault(require("./modules/health/routes"));
const routes_7 = __importDefault(require("./modules/certificates/routes"));
const routes_8 = __importDefault(require("./modules/quizzes/routes"));
const routes_9 = __importDefault(require("./modules/instructor/routes"));
const routes_10 = __importDefault(require("./modules/attachments/routes"));
const routes_11 = __importDefault(require("./modules/comments/routes"));
const seed_1 = __importDefault(require("./modules/system/seed"));
const routes_12 = __importDefault(require("./modules/chatbot/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'https://lms-ten-iota.vercel.app'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Request Logger
app.use(logger_1.requestLogger);
// Static files for certificates
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'LMS Backend is running', version: 'v2.0-chatbot-' + Date.now() });
});
// Mount Routes
app.use('/api/auth', routes_1.default);
app.use('/api/subjects', routes_2.default);
app.use('/api/videos', routes_3.default);
app.use('/api/progress', routes_4.default);
app.use('/api/enroll', routes_5.default); // Mount for POST /api/enroll/:id
app.use('/api/enrollments', routes_5.default); // Mount for GET /api/enrollments
app.use('/api/system', seed_1.default);
app.use('/api/health', routes_6.default);
app.use('/api/certificates', routes_7.default);
app.use('/api/quizzes', routes_8.default);
app.use('/api/instructor', routes_9.default);
app.use('/api/attachments', routes_10.default);
app.use('/api/comments', routes_11.default);
app.use('/api/chatbot', routes_12.default);
// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} does not exist` });
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map