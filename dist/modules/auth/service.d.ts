export declare class AuthService {
    private generateAccessToken;
    private generateRefreshToken;
    register(email: string, passwordRaw: string, name: string, role?: string): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            role: import("../users/repository").UserRole;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, passwordRaw: string): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            role: import("../users/repository").UserRole;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshTokenRaw: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshTokenRaw: string): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=service.d.ts.map