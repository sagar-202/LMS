import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

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
    is_correct?: boolean; // Optional because we hide it from students
}

export interface UserAttempt {
    id: number;
    user_id: number;
    quiz_id: number;
    score: number;
    is_passed: boolean;
    attempted_at: Date;
}

export class QuizzesRepository {
    async getQuizByVideoId(videoId: number): Promise<Quiz | null> {
        const query = 'SELECT * FROM quizzes WHERE video_id = ? LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [videoId]);
        if (rows.length === 0) return null;
        return rows[0] as Quiz;
    }

    async getQuestionsByQuizId(quiz_id: number): Promise<Question[]> {
        const query = 'SELECT * FROM questions WHERE quiz_id = ?';
        const [rows] = await db.query<RowDataPacket[]>(query, [quiz_id]);
        return rows as Question[];
    }

    async getAnswersByQuestionIds(questionIds: number[]): Promise<Answer[]> {
        if (questionIds.length === 0) return [];
        const placeholders = questionIds.map(() => '?').join(',');
        const query = `SELECT * FROM answers WHERE question_id IN (${placeholders})`;
        const [rows] = await db.query<RowDataPacket[]>(query, questionIds);
        return rows as Answer[];
    }

    async saveAttempt(userId: number, quizId: number, score: number, isPassed: boolean): Promise<UserAttempt> {
        const query = 'INSERT INTO user_attempts (user_id, quiz_id, score, is_passed) VALUES (?, ?, ?, ?)';
        const [result] = await db.query<ResultSetHeader>(query, [userId, quizId, score, isPassed]);
        
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM user_attempts WHERE id = ?', [result.insertId]);
        return rows[0] as UserAttempt;
    }

    async getBestAttempt(userId: number, quizId: number): Promise<UserAttempt | null> {
        const query = 'SELECT * FROM user_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY score DESC LIMIT 1';
        const [rows] = await db.query<RowDataPacket[]>(query, [userId, quizId]);
        if (rows.length === 0) return null;
        return rows[0] as UserAttempt;
    }
}

export const quizzesRepository = new QuizzesRepository();
