import { CommentRecord } from './repository';
export interface CommentNode extends CommentRecord {
    replies: CommentNode[];
}
export declare class CommentsService {
    addComment(data: {
        lesson_id: number;
        user_id: number;
        content: string;
        parent_id?: number | null;
    }): Promise<CommentRecord>;
    getLessonCommentsTree(lessonId: number): Promise<CommentNode[]>;
}
export declare const commentsService: CommentsService;
//# sourceMappingURL=service.d.ts.map