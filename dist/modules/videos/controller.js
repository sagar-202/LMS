"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosController = exports.VideosController = void 0;
const service_1 = require("./service");
class VideosController {
    /**
     * GET /api/videos/:videoId
     * Retrives metadata for a video along with previous_video_id and next_video_id
     */
    getVideo = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const videoId = parseInt(req.params.videoId, 10);
            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }
            const payload = await service_1.videosService.getVideoWithNavigation(videoId, userId);
            res.status(200).json({
                success: true,
                data: payload
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.VideosController = VideosController;
exports.videosController = new VideosController();
//# sourceMappingURL=controller.js.map