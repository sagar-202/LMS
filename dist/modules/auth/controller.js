"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const service_1 = require("./service");
class AuthController {
    setRefreshCookie(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
    }
    register = async (req, res, next) => {
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
            const { user, accessToken, refreshToken } = await service_1.authService.register(email, password, name, role);
            this.setRefreshCookie(res, refreshToken);
            res.status(201).json({
                success: true,
                data: {
                    user,
                    accessToken,
                    message: 'Registration successful'
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const { user, accessToken, refreshToken } = await service_1.authService.login(email, password);
            this.setRefreshCookie(res, refreshToken);
            res.status(200).json({
                success: true,
                data: {
                    user,
                    accessToken,
                    message: 'Login successful'
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token not found' });
            }
            const { accessToken } = await service_1.authService.refresh(refreshToken);
            res.status(201).json({
                success: true,
                data: { accessToken }
            });
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                await service_1.authService.logout(refreshToken);
            }
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.status(200).json({
                success: true,
                data: { message: 'Logged out successfully' }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=controller.js.map