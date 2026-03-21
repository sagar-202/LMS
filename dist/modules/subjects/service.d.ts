import { Subject } from './repository';
export interface VideoNode {
    id: number;
    title: string;
    order_index: number;
    duration_seconds: number;
    is_completed: boolean;
    locked: boolean;
}
export interface SectionNode {
    id: number;
    title: string;
    order_index: number;
    videos: VideoNode[];
}
export interface SubjectTree extends Omit<Subject, 'is_published' | 'created_at' | 'updated_at'> {
    total_duration: number;
    lessons_count: number;
    sections: SectionNode[];
}
export declare class SubjectsService {
    getAllPublishedSubjects(): Promise<{
        youtube_url: string | null;
        id: number;
        title: string;
        slug: string;
        description: string;
        category: string;
        difficulty: string;
        lessons_count: number;
        total_duration: number;
        is_published: boolean;
        thumbnail_url?: string;
        first_video_id?: string;
        created_at: Date;
        updated_at: Date;
    }[]>;
    getSubjectById(subjectId: number): Promise<Subject>;
    getSubjectTree(subjectId: number, userId: number): Promise<SubjectTree>;
    getSmartResumeVideo(subjectId: number, userId: number): Promise<number | null>;
}
export declare const subjectsService: SubjectsService;
//# sourceMappingURL=service.d.ts.map