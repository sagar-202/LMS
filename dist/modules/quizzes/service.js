"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizzesService = exports.QuizzesService = void 0;
const repository_1 = require("./repository");
const service_1 = require("../progress/service");
class QuizzesService {
    async getQuizForLesson(videoId, isAdmin = false) {
        const quiz = await repository_1.quizzesRepository.getQuizByVideoId(videoId);
        if (!quiz)
            return null;
        const questions = await repository_1.quizzesRepository.getQuestionsByQuizId(quiz.id);
        const questionIds = questions.map(q => q.id);
        const allAnswers = await repository_1.quizzesRepository.getAnswersByQuestionIds(questionIds);
        // Group answers by question and strip is_correct if not admin
        const quizData = {
            ...quiz,
            questions: questions.map(question => ({
                ...question,
                answers: allAnswers
                    .filter(a => a.question_id === question.id)
                    .map(a => {
                    const { is_correct, ...publicAnswer } = a;
                    return isAdmin ? a : publicAnswer;
                })
            }))
        };
        return quizData;
    }
    async submitQuiz(userId, quizId, userAnswers) {
        // 1. Fetch full quiz with correct answers
        const questions = await repository_1.quizzesRepository.getQuestionsByQuizId(quizId);
        const questionIds = questions.map(q => q.id);
        const allAnswers = await repository_1.quizzesRepository.getAnswersByQuestionIds(questionIds);
        const quizResult = await require('../../config/db').default.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
        const quiz = quizResult[0][0];
        if (!quiz)
            throw { statusCode: 404, message: 'Quiz not found' };
        // 2. Calculate score
        let correctCount = 0;
        const totalQuestions = questions.length;
        userAnswers.forEach(ua => {
            const correctPortion = allAnswers.find(a => a.question_id === ua.questionId && a.is_correct);
            if (correctPortion && correctPortion.id === ua.answerId) {
                correctCount++;
            }
        });
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const isPassed = score >= quiz.passing_score;
        // 3. Save attempt
        const attempt = await repository_1.quizzesRepository.saveAttempt(userId, quizId, score, isPassed);
        // 4. If passed, mark lesson as complete
        if (isPassed) {
            // We need the videoId to update progress
            await service_1.progressService.updateVideoProgress(userId, quiz.video_id, 0, true);
        }
        return {
            score,
            passed: isPassed,
            attempt_id: attempt.id,
            attempt,
            correctCount,
            totalQuestions,
            passingScore: quiz.passing_score
        };
    }
}
exports.QuizzesService = QuizzesService;
exports.quizzesService = new QuizzesService();
//# sourceMappingURL=service.js.map