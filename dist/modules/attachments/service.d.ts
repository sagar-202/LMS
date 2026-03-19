import { LessonAttachment } from './repository';
export declare class AttachmentsService {
    addAttachment(userId: number, lessonId: number, fileUrl: string, fileType: string): Promise<LessonAttachment>;
    getLessonAttachments(lessonId: number): Promise<LessonAttachment[]>;
}
export declare const attachmentsService: AttachmentsService;
//# sourceMappingURL=service.d.ts.map