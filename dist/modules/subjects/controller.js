"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectsController = exports.SubjectsController = void 0;
const service_1 = require("./service");
class SubjectsController {
    /**
     * GET /api/subjects
     * Retrieves a list of all published subjects
     */
    getAll = async (req, res, next) => {
        try {
            const subjects = await service_1.subjectsService.getAllPublishedSubjects();
            res.status(200).json({
                success: true,
                data: subjects
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /api/subjects/:subjectId
     * Retrieves details for a specific subject
     */
    getById = async (req, res, next) => {
        try {
            const subjectId = parseInt(req.params.subjectId, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }
            const subject = await service_1.subjectsService.getSubjectById(subjectId);
            res.status(200).json({
                success: true,
                data: subject
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /api/subjects/:subjectId/tree
     * Retrieves the fully nested structure for a specific subject
     */
    getTree = async (req, res, next) => {
        try {
            const userId = parseInt(req.header('X-User-Id') || '1', 10);
            const subjectId = parseInt(req.params.subjectId, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }
            const tree = await service_1.subjectsService.getSubjectTree(subjectId, userId);
            res.status(200).json({
                success: true,
                data: tree
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /api/subjects/:subjectId/first-video
     * Determines the smartest video to start/resume for the user
     */
    getSmartResume = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const subjectId = parseInt(req.params.subjectId, 10);
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID parameter' });
            }
            const videoId = await service_1.subjectsService.getSmartResumeVideo(subjectId, userId);
            if (!videoId) {
                return res.status(404).json({ message: 'No videos found for this subject' });
            }
            res.status(200).json({
                success: true,
                data: { video_id: videoId }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.SubjectsController = SubjectsController;
exports.subjectsController = new SubjectsController();
//# sourceMappingURL=controller.js.map