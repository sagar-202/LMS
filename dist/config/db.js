"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
// Create a connection pool
const pool = promise_1.default.createPool({
    host: env_1.env.DB_HOST,
    port: env_1.env.DB_PORT,
    user: env_1.env.DB_USER,
    password: env_1.env.DB_PASSWORD,
    database: env_1.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false, // Required for Aiven/DigitalOcean etc if not providing CA
    }
});
// Test the connection
const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ MySQL Database connected successfully to '${env_1.env.DB_NAME}' on ${env_1.env.DB_HOST}:${env_1.env.DB_PORT}`);
        connection.release(); // Release connection back to the pool
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Exit process with failure
    }
};
exports.connectDB = connectDB;
exports.default = pool;
//# sourceMappingURL=db.js.map