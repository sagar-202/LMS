import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../modules/users/repository';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: UserRole;
    };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized, no token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number; email: string; role: UserRole };
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized, token failed',
        });
    }
};

/**
 * Middleware to restrict access based on user roles
 */
export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `User role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
