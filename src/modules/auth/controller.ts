import { Request, Response, NextFunction } from 'express';
import { authService } from './service';

export class AuthController {

    private setRefreshCookie(res: Response, refreshToken: string) {
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax', // Use 'none' for cross-site prod
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        console.log('--- Registration Request Received ---');
        console.log('Body:', req.body);
        try {
            const { email, password, name, role = 'student' } = req.body;

            if (!email || !password || !name) {
                console.log('Validation failed: missing fields');
                return res.status(400).json({ message: 'Email, password, and name are required' });
            }

            const validRoles = ['student', 'instructor'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role provided' });
            }

            const { user, accessToken, refreshToken } = await authService.register(email, password, name, role);

            this.setRefreshCookie(res, refreshToken);

            res.status(201).json({
                success: true,
                data: {
                    user,
                    accessToken,
                    message: 'Registration successful'
                }
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const { user, accessToken, refreshToken } = await authService.login(email, password);

            this.setRefreshCookie(res, refreshToken);

            res.status(200).json({
                success: true,
                data: {
                    user,
                    accessToken,
                    message: 'Login successful'
                }
            });
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token not found' });
            }

            const { accessToken } = await authService.refresh(refreshToken);

            res.status(201).json({
                success: true,
                data: { accessToken }
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                await authService.logout(refreshToken);
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            });

            res.status(200).json({
                success: true,
                data: { message: 'Logged out successfully' }
            });
        } catch (error) {
            next(error);
        }
    };
}

export const authController = new AuthController();
