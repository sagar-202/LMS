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

    addLesson: (subjectId: number | string, sectionTitle: string, lessonData: any) =>
        apiFetch<{ videoId: number; sectionId: number }>('/instructor/lessons', {
            method: 'POST',
            body: JSON.stringify({ subjectId, sectionTitle, lessonData }),
        }),
};
