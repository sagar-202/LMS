"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = exports.CommentsService = void 0;
const repository_1 = require("./repository");
class CommentsService {
    async addComment(data) {
        if (!data.content || data.content.trim() === '') {
            throw { statusCode: 400, message: 'Comment content cannot be empty' };
        }
        if (data.parent_id) {
            const parent = await repository_1.commentsRepository.getById(data.parent_id);
            if (!parent)
                throw { statusCode: 404, message: 'Parent comment not found' };
            if (parent.lesson_id !== data.lesson_id) {
                throw { statusCode: 400, message: 'Parent comment belongs to a different lesson' };
            }
        }
        const id = await repository_1.commentsRepository.create(data);
        const newComment = await repository_1.commentsRepository.getById(id);
        if (!newComment)
            throw { statusCode: 500, message: 'Failed to retrieve created comment' };
        return newComment;
    }
    async getLessonCommentsTree(lessonId) {
        const flatComments = await repository_1.commentsRepository.getByLessonId(lessonId);
        const commentMap = new Map();
        const rootNodes = [];
        // First pass: Create nodes and map them
        flatComments.forEach(comment => {
            const node = { ...comment, replies: [] };
            commentMap.set(node.id, node);
        });
        // Second pass: Link replies to parents or roots
        flatComments.forEach(comment => {
            const node = commentMap.get(comment.id);
            if (comment.parent_id && commentMap.has(comment.parent_id)) {
                const parent = commentMap.get(comment.parent_id);
                parent.replies.push(node);
            }
            else {
                rootNodes.push(node);
            }
        });
        return rootNodes;
    }
}
exports.CommentsService = CommentsService;
exports.commentsService = new CommentsService();
//# sourceMappingURL=service.js.map