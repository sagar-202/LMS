import { apiFetch } from './apiClient';

export interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
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
    sections: SectionNode[];
}

export interface VideoDetail {
    id: number;
    title: string;
    description: string;
    youtube_video_id: string;
    previous_video_id: number | null;
    next_video_id: number | null;
    locked?: boolean;
    is_completed?: boolean;
}

export interface VideoProgress {
    last_position_seconds: number;
    is_completed: boolean;
}

export const lmsApi = {
    getSubjects: () => apiFetch<Subject[]>('/subjects'),

    getSubjectTree: (subjectId: number | string) =>
        apiFetch<SubjectTree>(`/subjects/${subjectId}/tree`),

    getVideo: (videoId: number | string) =>
        apiFetch<VideoDetail>(`/videos/${videoId}`),

    getVideoProgress: (videoId: number | string) =>
        apiFetch<VideoProgress>(`/progress/videos/${videoId}`),

    updateVideoProgress: (videoId: number | string, data: Partial<VideoProgress>) =>
        apiFetch<void>(`/progress/videos/${videoId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
