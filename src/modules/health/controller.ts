import { Request, Response } from 'express';

export class HealthController {
    getHealth = (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            data: { status: 'ok', timestamp: new Date().toISOString() }
        });
    };
}

export const healthController = new HealthController();
