import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/users/repository';
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: UserRole;
    };
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to restrict access based on user roles
 */
export declare const authorizeRoles: (...roles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authHandler.d.ts.map