import mysql from 'mysql2/promise';
import { env } from './env';

// Create a connection pool
const pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test the connection
export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ MySQL Database connected successfully to '${env.DB_NAME}' on ${env.DB_HOST}:${env.DB_PORT}`);
        connection.release(); // Release connection back to the pool
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Exit process with failure
    }
};

export default pool;
