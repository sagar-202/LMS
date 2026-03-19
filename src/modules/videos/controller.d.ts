import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class VideosController {
    /**
     * GET /api/videos/:videoId
     * Retrives metadata for a video along with previous_video_id and next_video_id
     */
    getVideo: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const videosController: VideosController;
//# sourceMappingURL=controller.d.ts.map