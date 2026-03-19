"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorController = exports.InstructorController = void 0;
const service_1 = require("./service");
class InstructorController {
    createCourse = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ message: 'Not authenticated' });
            const course = await service_1.instructorService.createCourse(userId, req.body);
            res.status(201).json({
                success: true,
                data: course
            });
        }
        catch (error) {
            next(error);
        }
    };
    addLesson = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { subjectId, sectionTitle, lessonData } = req.body;
            if (!userId)
                return res.status(401).json({ message: 'Not authenticated' });
            const result = await service_1.instructorService.addLesson(userId, parseInt(subjectId), sectionTitle, lessonData);
            res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    getDashboard = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ message: 'Not authenticated' });
            const courses = await service_1.instructorService.getInstructorDashboard(userId);
            res.status(200).json({
                success: true,
                data: courses
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.InstructorController = InstructorController;
exports.instructorController = new InstructorController();
//# sourceMappingURL=controller.js.map