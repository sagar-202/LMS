export interface Quiz {
    id: number;
    video_id: number;
    title: string;
    passing_score: number;
}
export interface Question {
    id: number;
    quiz_id: number;
    question_text: string;
}
export interface Answer {
    id: number;
    question_id: number;
    answer_text: string;
    is_correct?: boolean;
}
export interface UserAttempt {
    id: number;
    user_id: number;
    quiz_id: number;
    score: number;
    is_passed: boolean;
    attempted_at: Date;
}
export declare class QuizzesRepository {
    getQuizByVideoId(videoId: number): Promise<Quiz | null>;
    getQuestionsByQuizId(quiz_id: number): Promise<Question[]>;
    getAnswersByQuestionIds(questionIds: number[]): Promise<Answer[]>;
    saveAttempt(userId: number, quizId: number, score: number, isPassed: boolean): Promise<UserAttempt>;
    getBestAttempt(userId: number, quizId: number): Promise<UserAttempt | null>;
}
export declare const quizzesRepository: QuizzesRepository;
//# sourceMappingURL=repository.d.ts.map