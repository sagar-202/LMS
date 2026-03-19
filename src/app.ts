import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './modules/auth/routes';
import subjectsRoutes from './modules/subjects/routes';
import videosRoutes from './modules/videos/routes';
import progressRoutes from './modules/progress/routes';
import enrollmentRoutes from './modules/enrollment/routes';
import healthRoutes from './modules/health/routes';
import certificatesRoutes from './modules/certificates/routes';
import path from 'path';

const app: Application = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'https://lms-ten-iota.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request Logger
app.use(requestLogger);

// Static files for certificates
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'LMS Backend is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/certificates', certificatesRoutes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} does not exist` });
});

// Global Error Handler
app.use(errorHandler);

export default app;
