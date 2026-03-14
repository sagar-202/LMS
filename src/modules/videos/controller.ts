import { Request, Response, NextFunction } from 'express';
import { videosService } from './service';

export class VideosController {
    /**
     * GET /api/videos/:videoId
     * Retrives metadata for a video along with previous_video_id and next_video_id
     */
    getVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const videoId = parseInt(req.params.videoId, 10);
            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }

            const payload = await videosService.getVideoWithNavigation(videoId);
            res.status(200).json(payload);
        } catch (error) {
            next(error);
        }
    };
}

export const videosController = new VideosController();
