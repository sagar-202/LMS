import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/authHandler';
export declare class CertificatesController {
    generate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getMyCertificates: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const certificatesController: CertificatesController;
//# sourceMappingURL=controller.d.ts.map