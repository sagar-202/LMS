"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsController = exports.AttachmentsController = void 0;
const service_1 = require("./service");
class AttachmentsController {
    addAttachment = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { lessonId, fileUrl, fileType } = req.body;
            if (!userId)
                return res.status(401).json({ message: 'Not authenticated' });
            const attachment = await service_1.attachmentsService.addAttachment(userId, parseInt(lessonId), fileUrl, fileType);
            res.status(201).json({
                success: true,
                data: attachment
            });
        }
        catch (error) {
            next(error);
        }
    };
    getLessonAttachments = async (req, res, next) => {
        try {
            const { id } = req.params;
            const attachments = await service_1.attachmentsService.getLessonAttachments(parseInt(id));
            res.status(200).json({
                success: true,
                data: attachments
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AttachmentsController = AttachmentsController;
exports.attachmentsController = new AttachmentsController();
//# sourceMappingURL=controller.js.map