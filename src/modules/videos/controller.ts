import { Request, Response, NextFunction } from 'express';
import { videosService } from './service';
import { AuthRequest } from '../../middleware/authHandler';

export class VideosController {
    /**
     * GET /api/videos/:videoId
     * Retrives metadata for a video along with previous_video_id and next_video_id
     */
    getVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const videoId = parseInt(req.params.videoId as string, 10);
            if (isNaN(videoId)) {
                return res.status(400).json({ message: 'Invalid video ID parameter' });
            }

            const payload = await videosService.getVideoWithNavigation(videoId, userId);
            res.status(200).json(payload);
        } catch (error) {
            next(error);
        }
    };
}

export const videosController = new VideosController();
