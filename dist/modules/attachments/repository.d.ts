export interface LessonAttachment {
    id: number;
    lesson_id: number;
    file_url: string;
    file_type: 'pdf' | 'zip' | 'doc' | 'docx' | 'other';
    created_at: Date;
}
export declare class AttachmentsRepository {
    create(lessonId: number, fileUrl: string, fileType: string): Promise<LessonAttachment>;
    getByLessonId(lessonId: number): Promise<LessonAttachment[]>;
}
export declare const attachmentsRepository: AttachmentsRepository;
//# sourceMappingURL=repository.d.ts.map