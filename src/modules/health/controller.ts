import { Request, Response } from 'express';

export class HealthController {
    getHealth = (req: Request, res: Response) => {
        res.json({ status: 'ok' });
    };
}

export const healthController = new HealthController();
