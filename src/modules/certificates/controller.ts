import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
import { certificatesService } from './service';

export class CertificatesController {
    generate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const subjectId = parseInt(req.params.subjectId as string);

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID' });
            }

            const certificate = await certificatesService.generateCertificate(userId, subjectId);

            res.status(201).json({
                success: true,
                data: certificate
            });
        } catch (error) {
            next(error);
        }
    };

    getMyCertificates = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const certificates = await certificatesService.getMyCertificates(userId);

            res.status(200).json({
                success: true,
                data: certificates
            });
        } catch (error) {
            next(error);
        }
    };
}

export const certificatesController = new CertificatesController();
