"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const startServer = async () => {
    try {
        // Initialize database connection
        await (0, db_1.connectDB)();
        const PORT = env_1.env.PORT || 3000;
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map