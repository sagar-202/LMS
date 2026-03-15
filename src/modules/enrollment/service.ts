import { enrollmentRepository } from './repository';
import { subjectsRepository } from '../subjects/repository';

export class EnrollmentService {
    async enrollUser(userId: number, subjectId: number): Promise<void> {
        // 1. Check if subject exists
        const subject = await subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found' };
        }

        // 2. Perform enrollment (repository uses INSERT IGNORE to prevent duplicates)
        await enrollmentRepository.enrollUser(userId, subjectId);
    }

    async getUserEnrollments(userId: number): Promise<number[]> {
        return await enrollmentRepository.getEnrollmentsByUserId(userId);
    }

    async isUserEnrolled(userId: number, subjectId: number): Promise<boolean> {
        return await enrollmentRepository.isUserEnrolled(userId, subjectId);
    }
}

export const enrollmentService = new EnrollmentService();
