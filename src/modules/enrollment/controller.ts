import { Response, NextFunction } from 'express';
import { enrollmentService } from './service';
import { AuthRequest } from '../../middleware/authHandler';

export class EnrollmentController {
    async enroll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id; // Guaranteed by protect middleware
            const subjectId = parseInt(req.params.subjectId as string);

            if (isNaN(subjectId)) {
                return res.status(400).json({ status: 'error', message: 'Invalid subject ID' });
            }

            await enrollmentService.enrollUser(userId, subjectId);

            res.status(201).json({
                status: 'success',
                success: true,
                message: 'Enrolled successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async getEnrollments(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const enrollments = await enrollmentService.getUserEnrollments(userId);

            res.status(200).json({
                status: 'success',
                data: enrollments
            });
        } catch (error) {
            next(error);
        }
    }
}

export const enrollmentController = new EnrollmentController();
