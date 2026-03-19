import { commentsRepository, CommentRecord } from './repository';

export interface CommentNode extends CommentRecord {
    replies: CommentNode[];
}

export class CommentsService {
    async addComment(data: { lesson_id: number, user_id: number, content: string, parent_id?: number | null }): Promise<CommentRecord> {
        if (!data.content || data.content.trim() === '') {
            throw { statusCode: 400, message: 'Comment content cannot be empty' };
        }

        if (data.parent_id) {
            const parent = await commentsRepository.getById(data.parent_id);
            if (!parent) throw { statusCode: 404, message: 'Parent comment not found' };
            if (parent.lesson_id !== data.lesson_id) {
                throw { statusCode: 400, message: 'Parent comment belongs to a different lesson' };
            }
        }

        const id = await commentsRepository.create(data);
        const newComment = await commentsRepository.getById(id);
        if (!newComment) throw { statusCode: 500, message: 'Failed to retrieve created comment' };
        
        return newComment;
    }

    async getLessonCommentsTree(lessonId: number): Promise<CommentNode[]> {
        const flatComments = await commentsRepository.getByLessonId(lessonId);
        
        const commentMap = new Map<number, CommentNode>();
        const rootNodes: CommentNode[] = [];

        // First pass: Create nodes and map them
        flatComments.forEach(comment => {
            const node: CommentNode = { ...comment, replies: [] };
            commentMap.set(node.id, node);
        });

        // Second pass: Link replies to parents or roots
        flatComments.forEach(comment => {
            const node = commentMap.get(comment.id)!;
            if (comment.parent_id && commentMap.has(comment.parent_id)) {
                const parent = commentMap.get(comment.parent_id)!;
                parent.replies.push(node);
            } else {
                rootNodes.push(node);
            }
        });

        return rootNodes;
    }
}

export const commentsService = new CommentsService();
