export declare class QuizzesService {
    getQuizForLesson(videoId: number, isAdmin?: boolean): Promise<{
        questions: {
            answers: {
                id: number;
                question_id: number;
                answer_text: string;
            }[];
            id: number;
            quiz_id: number;
            question_text: string;
        }[];
        id: number;
        video_id: number;
        title: string;
        passing_score: number;
    } | null>;
    submitQuiz(userId: number, quizId: number, userAnswers: {
        questionId: number;
        answerId: number;
    }[]): Promise<{
        score: number;
        passed: boolean;
        attempt_id: number;
        attempt: import("./repository").UserAttempt;
        correctCount: number;
        totalQuestions: number;
        passingScore: number;
    }>;
}
export declare const quizzesService: QuizzesService;
//# sourceMappingURL=service.d.ts.map