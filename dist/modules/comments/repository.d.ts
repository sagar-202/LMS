export interface CommentRecord {
    id: number;
    lesson_id: number;
    user_id: number;
    user_name: string;
    user_role: string;
    content: string;
    parent_id: number | null;
    created_at: Date;
    updated_at: Date;
}
export declare class CommentsRepository {
    create(data: {
        lesson_id: number;
        user_id: number;
        content: string;
        parent_id?: number | null;
    }): Promise<number>;
    getByLessonId(lessonId: number): Promise<CommentRecord[]>;
    getById(commentId: number): Promise<CommentRecord | null>;
}
export declare const commentsRepository: CommentsRepository;
//# sourceMappingURL=repository.d.ts.map