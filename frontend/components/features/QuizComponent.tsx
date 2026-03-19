'use client';

import React, { useState, useEffect } from 'react';
import { lmsApi, Quiz, QuizResult } from '@/lib/api';
import Button from '@/components/ui/Button';

interface QuizComponentProps {
    lessonId: number;
}

export default function QuizComponent({ lessonId }: QuizComponentProps) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<QuizResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const data = await lmsApi.getQuizByLessonId(lessonId);
                setQuiz(data);
            } catch (err) {
                console.error('Failed to fetch quiz:', err);
                setError('Could not load quiz for this lesson.');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) fetchQuiz();
    }, [lessonId]);

    const handleAnswerSelect = (questionId: number, answerId: number) => {
        if (result) return; // Prevent change after submission
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        const answersArray = Object.entries(selectedAnswers).map(([qId, aId]) => ({
            questionId: parseInt(qId),
            answerId: aId
        }));

        if (answersArray.length < quiz.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            const data = await lmsApi.submitQuiz(lessonId, answersArray);
            setResult(data);
        } catch (err) {
            console.error('Quiz submission failed:', err);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="p-12 text-center animate-pulse">
            <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4"></div>
            <div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 rounded-2xl mx-auto"></div>
        </div>
    );

    if (error || !quiz) return null;

    if (result) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-12 text-center border border-gray-100 dark:border-gray-700 shadow-2xl shadow-blue-500/10 animate-in zoom-in duration-500">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.passed ? 'bg-green-50 dark:bg-green-900/20 text-green-500' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                    {result.passed ? (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                    Your score: <span className="text-blue-600 font-black">{result.score}%</span> (Required: {quiz.passing_score}%)
                </p>
                {!result.passed && (
                    <Button onClick={() => { setResult(null); setSelectedAnswers({}); }} variant="outline">
                        Try Again
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-10 shadow-xl">
            <header className="mb-10 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">Knowledge Check</span>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">{quiz.title}</h2>
            </header>

            <div className="space-y-12">
                {quiz.questions.map((question, qIdx) => (
                    <div key={question.id} className="space-y-6">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                                {qIdx + 1}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {question.content}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3 pl-12">
                            {question.answers.map((answer) => (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerSelect(question.id, answer.id)}
                                    className={`text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200 font-medium ${
                                        selectedAnswers[question.id] === answer.id
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:border-blue-200 dark:hover:border-blue-800'
                                    }`}
                                >
                                    {answer.content}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                <Button 
                    onClick={handleSubmit} 
                    variant="primary" 
                    size="lg" 
                    className="px-12 rounded-2xl shadow-xl shadow-blue-500/20"
                    disabled={submitting}
                >
                    {submitting ? 'Submitting Responses...' : 'Finish Assessment'}
                </Button>
            </div>
        </div>
    );
}
