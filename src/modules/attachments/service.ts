import { attachmentsRepository, LessonAttachment } from './repository';
import { videosRepository } from '../videos/repository';
import { instructorRepository } from '../instructor/repository';

export class AttachmentsService {
    async addAttachment(userId: number, lessonId: number, fileUrl: string, fileType: string): Promise<LessonAttachment> {
        // 1. Verify lesson exists
        const video = await videosRepository.getVideoById(lessonId);
        if (!video) throw { statusCode: 404, message: 'Lesson not found' };

        // 2. Verify instructor ownership (unless admin)
        // Note: For now, I'll allow admins or the associated instructor.
        const isOwner = await instructorRepository.isInstructorOfCourse(userId, video.subject_id);
        if (!isOwner) throw { statusCode: 403, message: 'You do not have permission to add attachments to this lesson' };

        // 3. Simple file type validation
        const allowedTypes = ['pdf', 'zip', 'doc', 'docx', 'other'];
        if (!allowedTypes.includes(fileType.toLowerCase())) {
            throw { statusCode: 400, message: `Invalid file type. Supported: ${allowedTypes.join(', ')}` };
        }

        return await attachmentsRepository.create(lessonId, fileUrl, fileType.toLowerCase());
    }

    async getLessonAttachments(lessonId: number): Promise<LessonAttachment[]> {
        // 1. Verify lesson exists
        const video = await videosRepository.getVideoById(lessonId);
        if (!video) throw { statusCode: 404, message: 'Lesson not found' };

        return await attachmentsRepository.getByLessonId(lessonId);
    }
}

export const attachmentsService = new AttachmentsService();
