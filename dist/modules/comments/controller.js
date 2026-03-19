"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsController = exports.CommentsController = void 0;
const service_1 = require("./service");
class CommentsController {
    addComment = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { lessonId, content, parentId } = req.body;
            if (!userId)
                return res.status(401).json({ message: 'Not authenticated' });
            const comment = await service_1.commentsService.addComment({
                lesson_id: parseInt(lessonId),
                user_id: userId,
                content,
                parent_id: parentId ? parseInt(parentId) : null
            });
            res.status(201).json({
                success: true,
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    };
    getLessonComments = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const comments = await service_1.commentsService.getLessonCommentsTree(parseInt(lessonId));
            res.status(200).json({
                success: true,
                data: comments
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CommentsController = CommentsController;
exports.commentsController = new CommentsController();
//# sourceMappingURL=controller.js.map