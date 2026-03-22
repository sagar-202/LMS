import { apiFetch } from './apiClient';

export interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: string;
    lessons_count: number;
    total_duration: number;
    is_published: boolean;
    thumbnail?: string;
    thumbnail_url?: string;
    youtube_url?: string;
}

export interface VideoNode {
    id: number;
    title: string;
    order_index: number;
    locked?: boolean;
    is_completed?: boolean;
}

export interface SectionNode {
    id: number;
    title: string;
    order_index: number;
    videos: VideoNode[];
}

export interface SubjectTree {
    id: number;
    title: string;
    description: string;
    total_duration: number;
    lessons_count: number;
    sections: SectionNode[];
}

export interface VideoDetail {
    id: number;
    title: string;
    description: string;
    youtube_video_id: string;
    duration_seconds: number;
    previous_video_id: number | null;
    next_video_id: number | null;
    locked?: boolean;
    is_completed?: boolean;
}

export interface VideoProgress {
    last_position_seconds: number;
    is_completed: boolean;
}

export interface SubjectProgress {
    total_videos: number;
    completed_videos: number;
    percent_complete: number;
    last_video_id: number | null;
}

export interface OverallStats {
    completed_lessons: number;
    total_lessons: number;
}

export interface LastWatchedProgress {
    subject_id: number;
    subject_title: string;
    video_id: number;
    video_title: string;
    youtube_video_id: string;
    lesson_number: number;
    total_lessons: number;
}

export interface Quiz {
    id: number;
    title: string;
    passing_score: number;
    questions: {
        id: number;
        question_text: string;
        answers: {
            id: number;
            answer_text: string;
        }[];
    }[];
}

export interface QuizResult {
    score: number;
    passed: boolean;
    attempt_id: number;
}

export interface Certificate {
    id: number;
    subject_id: number;
    subject_title: string;
    issued_at: string;
    certificate_url: string;
}

export interface Attachment {
    id: number;
    lesson_id: number;
    file_url: string;
    file_type: string;
    created_at: string;
}

export interface CommentNode {
    id: number;
    content: string;
    user_name: string;
    user_role: string;
    created_at: string;
    parent_id: number | null;
    replies: CommentNode[];
}

export const lmsApi = {
    getSubjects: () => apiFetch<Subject[]>('/subjects'),

    getSubject: (subjectId: number | string) =>
        apiFetch<Subject>(`/subjects/${subjectId}`),

    getSmartResumeVideo: (subjectId: number | string) =>
        apiFetch<{ video_id: number }>(`/subjects/${subjectId}/first-video`),

    getSubjectTree: (subjectId: number | string) =>
        apiFetch<SubjectTree>(`/subjects/${subjectId}/tree`),

    getSubjectProgress: (subjectId: number | string) =>
        apiFetch<SubjectProgress>(`/progress/subjects/${subjectId}`),

    getOverallStats: () =>
        apiFetch<OverallStats>('/progress/stats'),

    getLastWatched: () =>
        apiFetch<LastWatchedProgress | null>('/progress/last-watched'),

    getVideo: (videoId: number | string) =>
        apiFetch<VideoDetail>(`/videos/${videoId}`),

    getVideoProgress: (videoId: number | string) =>
        apiFetch<VideoProgress>(`/progress/videos/${videoId}`),

    updateVideoProgress: (videoId: number | string, data: Partial<VideoProgress>) =>
        apiFetch<void>(`/progress/videos/${videoId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    enrollInSubject: (subjectId: number | string) =>
        apiFetch<{ status: string; message: string }>(`/enroll/${subjectId}`, {
            method: 'POST',
        }),

    getEnrollments: () =>
        apiFetch<{ status: string; data: number[] }>('/enrollments'),

    // Instructor APIs
    getInstructorDashboard: () =>
        apiFetch<Subject[]>('/instructor/dashboard'),

    createCourse: (data: Partial<Subject>) =>
        apiFetch<{ id: number; slug: string }>('/instructor/courses', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    addLesson: (subjectId: number | string, sectionTitle: string, lessonData: unknown) =>
        apiFetch<{ videoId: number; sectionId: number }>('/instructor/lessons', {
            method: 'POST',
            body: JSON.stringify({ subjectId, sectionTitle, lessonData }),
        }),

    // Quiz APIs
    getQuizByLessonId: (lessonId: number | string) =>
        apiFetch<Quiz | null>(`/quizzes/video/${lessonId}`),

    submitQuiz: (quizId: number, answers: { questionId: number, answerId: number }[]) =>
        apiFetch<QuizResult>('/quizzes/submit', {
            method: 'POST',
            body: JSON.stringify({ quizId, answers }),
        }),

    // Certificate APIs
    generateCertificate: (subjectId: number | string) =>
        apiFetch<{ success: boolean; certificateId: number; pdfUrl: string }>(`/certificates/generate/${subjectId}`, {
            method: 'POST',
        }),

    getMyCertificates: () =>
        apiFetch<Certificate[]>('/certificates/my'),

    // Comment APIs
    getComments: (lessonId: number | string) =>
        apiFetch<CommentNode[]>(`/comments/${lessonId}`),

    addComment: (lessonId: number | string, content: string, parentId: number | null = null) =>
        apiFetch<CommentNode>('/comments', {
            method: 'POST',
            body: JSON.stringify({ lessonId, content, parentId }),
        }),

    // Attachment APIs
    getAttachments: (lessonId: number | string) =>
        apiFetch<Attachment[]>(`/videos/${lessonId}/attachments`),
};
