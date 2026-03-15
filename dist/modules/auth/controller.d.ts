import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    private setRefreshCookie;
    register: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    refresh: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=controller.d.ts.map