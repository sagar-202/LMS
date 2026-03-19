"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsService = exports.AttachmentsService = void 0;
const repository_1 = require("./repository");
const repository_2 = require("../videos/repository");
const repository_3 = require("../instructor/repository");
class AttachmentsService {
    async addAttachment(userId, lessonId, fileUrl, fileType) {
        // 1. Verify lesson exists
        const video = await repository_2.videosRepository.getVideoById(lessonId);
        if (!video)
            throw { statusCode: 404, message: 'Lesson not found' };
        // 2. Verify instructor ownership (unless admin)
        // Note: For now, I'll allow admins or the associated instructor.
        const isOwner = await repository_3.instructorRepository.isInstructorOfCourse(userId, video.subject_id);
        if (!isOwner)
            throw { statusCode: 403, message: 'You do not have permission to add attachments to this lesson' };
        // 3. Simple file type validation
        const allowedTypes = ['pdf', 'zip', 'doc', 'docx', 'other'];
        if (!allowedTypes.includes(fileType.toLowerCase())) {
            throw { statusCode: 400, message: `Invalid file type. Supported: ${allowedTypes.join(', ')}` };
        }
        return await repository_1.attachmentsRepository.create(lessonId, fileUrl, fileType.toLowerCase());
    }
    async getLessonAttachments(lessonId) {
        // 1. Verify lesson exists
        const video = await repository_2.videosRepository.getVideoById(lessonId);
        if (!video)
            throw { statusCode: 404, message: 'Lesson not found' };
        return await repository_1.attachmentsRepository.getByLessonId(lessonId);
    }
}
exports.AttachmentsService = AttachmentsService;
exports.attachmentsService = new AttachmentsService();
//# sourceMappingURL=service.js.map