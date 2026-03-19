import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
import { instructorService } from './service';

export class InstructorController {
    createCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Not authenticated' });

            const course = await instructorService.createCourse(userId, req.body);
            res.status(201).json({
                success: true,
                data: course
            });
        } catch (error) {
            next(error);
        }
    };

    addLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const { subjectId, sectionTitle, lessonData } = req.body;
            
            if (!userId) return res.status(401).json({ message: 'Not authenticated' });

            const result = await instructorService.addLesson(userId, parseInt(subjectId), sectionTitle, lessonData);
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Not authenticated' });

            const courses = await instructorService.getInstructorDashboard(userId);
            res.status(200).json({
                success: true,
                data: courses
            });
        } catch (error) {
            next(error);
        }
    };
}

export const instructorController = new InstructorController();
