import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
import { quizzesService } from './service';

export class QuizzesController {
    getQuizByLessonId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const videoId = parseInt(req.params.lessonId as string);
            const isAdmin = req.user?.role === 'admin';

            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid lesson ID' });
            }

            const quiz = await quizzesService.getQuizForLesson(videoId, isAdmin);

            if (!quiz) {
                return res.status(404).json({ message: 'No quiz found for this lesson' });
            }

            res.status(200).json({
                success: true,
                data: quiz
            });
        } catch (error) {
            next(error);
        }
    };

    submitQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const { quizId, answers } = req.body;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            if (!quizId || !Array.isArray(answers)) {
                return res.status(400).json({ message: 'Quiz ID and answers array are required' });
            }

            const result = await quizzesService.submitQuiz(userId, quizId, answers);

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

export const quizzesController = new QuizzesController();
