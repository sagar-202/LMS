"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = exports.EnrollmentService = void 0;
const repository_1 = require("./repository");
const repository_2 = require("../subjects/repository");
class EnrollmentService {
    async enrollUser(userId, subjectId) {
        // 1. Check if subject exists
        const subject = await repository_2.subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found' };
        }
        // 2. Perform enrollment (repository uses INSERT IGNORE to prevent duplicates)
        await repository_1.enrollmentRepository.enrollUser(userId, subjectId);
    }
    async getUserEnrollments(userId) {
        return await repository_1.enrollmentRepository.getEnrollmentsByUserId(userId);
    }
    async isUserEnrolled(userId, subjectId) {
        return await repository_1.enrollmentRepository.isUserEnrolled(userId, subjectId);
    }
}
exports.EnrollmentService = EnrollmentService;
exports.enrollmentService = new EnrollmentService();
//# sourceMappingURL=service.js.map