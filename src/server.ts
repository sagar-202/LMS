import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
    try {
        // Initialize database connection
        await connectDB();

        const PORT = env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
