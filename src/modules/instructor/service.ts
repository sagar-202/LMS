import { instructorRepository } from './repository';
import { Subject, Video } from '../subjects/repository';

export class InstructorService {
    async createCourse(userId: number, data: Partial<Subject>) {
        if (!data.title) throw { statusCode: 400, message: 'Title is required' };
        
        // Simple slug generation
        const slug = data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        
        const subjectId = await instructorRepository.createSubject({
            ...data,
            slug,
            is_published: data.is_published ?? false // Default to false for new courses
        });

        await instructorRepository.addInstructorToCourse(subjectId, userId);

        return { id: subjectId, slug };
    }

    async getInstructorDashboard(userId: number) {
        return await instructorRepository.getSubjectsByInstructor(userId);
    }

    async addLesson(userId: number, subjectId: number, sectionTitle: string, lessonData: Partial<Video>) {
        // 1. Verify ownership
        const isOwner = await instructorRepository.isInstructorOfCourse(userId, subjectId);
        if (!isOwner) throw { statusCode: 403, message: 'You do not have permission to manage this course' };

        // 2. Simple section handling: Create or reuse section (Keeping it simple for the CMS MVP)
        // In a real app, we'd fetch existing sections. Here we'll just create a new one for each batch or use a default.
        // For this task, I'll assume the instructor provides a section title.
        
        const sectionId = await instructorRepository.createSection(subjectId, sectionTitle, 1);
        
        const videoId = await instructorRepository.createVideo(sectionId, lessonData);

        return { videoId, sectionId };
    }
}

export const instructorService = new InstructorService();
