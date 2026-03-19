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
    first_video_id?: string;
    created_at: Date;
    updated_at: Date;
}
export interface Section {
    id: number;
    subject_id: number;
    title: string;
    order_index: number;
}
export interface Video {
    id: number;
    section_id: number;
    title: string;
    description: string;
    youtube_video_id: string;
    order_index: number;
    duration_seconds: number;
}
export declare class SubjectsRepository {
    getPublishedSubjects(): Promise<Subject[]>;
    getPublishedSubjectById(subjectId: number): Promise<Subject | null>;
    getSectionsBySubjectId(subjectId: number): Promise<Section[]>;
    getVideosBySectionIds(sectionIds: number[]): Promise<Video[]>;
    getFirstVideoOfSubject(subjectId: number): Promise<Video | null>;
}
export declare const subjectsRepository: SubjectsRepository;
//# sourceMappingURL=repository.d.ts.map