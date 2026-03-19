"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentController = exports.EnrollmentController = void 0;
const service_1 = require("./service");
class EnrollmentController {
    async enroll(req, res, next) {
        try {
            const userId = req.user.id; // Guaranteed by protect middleware
            const subjectId = parseInt(req.params.subjectId);
            if (isNaN(subjectId)) {
                return res.status(400).json({ status: 'error', message: 'Invalid subject ID' });
            }
            await service_1.enrollmentService.enrollUser(userId, subjectId);
            res.status(201).json({
                status: 'success',
                success: true,
                message: 'Enrolled successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getEnrollments(req, res, next) {
        try {
            const userId = req.user.id;
            const enrollments = await service_1.enrollmentService.getUserEnrollments(userId);
            res.status(200).json({
                status: 'success',
                data: enrollments
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EnrollmentController = EnrollmentController;
exports.enrollmentController = new EnrollmentController();
//# sourceMappingURL=controller.js.map