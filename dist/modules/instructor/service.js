"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorService = exports.InstructorService = void 0;
const repository_1 = require("./repository");
class InstructorService {
    async createCourse(userId, data) {
        if (!data.title)
            throw { statusCode: 400, message: 'Title is required' };
        // Simple slug generation
        const slug = data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        const subjectId = await repository_1.instructorRepository.createSubject({
            ...data,
            slug,
            is_published: data.is_published ?? false // Default to false for new courses
        });
        await repository_1.instructorRepository.addInstructorToCourse(subjectId, userId);
        return { id: subjectId, slug };
    }
    async getInstructorDashboard(userId) {
        return await repository_1.instructorRepository.getSubjectsByInstructor(userId);
    }
    async addLesson(userId, subjectId, sectionTitle, lessonData) {
        // 1. Verify ownership
        const isOwner = await repository_1.instructorRepository.isInstructorOfCourse(userId, subjectId);
        if (!isOwner)
            throw { statusCode: 403, message: 'You do not have permission to manage this course' };
        // 2. Simple section handling: Create or reuse section (Keeping it simple for the CMS MVP)
        // In a real app, we'd fetch existing sections. Here we'll just create a new one for each batch or use a default.
        // For this task, I'll assume the instructor provides a section title.
        const sectionId = await repository_1.instructorRepository.createSection(subjectId, sectionTitle, 1);
        const videoId = await repository_1.instructorRepository.createVideo(sectionId, lessonData);
        return { videoId, sectionId };
    }
}
exports.InstructorService = InstructorService;
exports.instructorService = new InstructorService();
//# sourceMappingURL=service.js.map