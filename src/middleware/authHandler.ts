import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
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
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number; email: string };
        req.user = {
            id: decoded.userId,
            email: decoded.email,
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
