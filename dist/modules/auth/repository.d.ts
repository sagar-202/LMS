import { RowDataPacket } from 'mysql2/promise';
import { User } from '../users/repository';
export declare class AuthRepository {
    createUser(email: string, passwordHash: string, name: string, role?: string): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    storeRefreshToken(userId: number, tokenHash: string, expiresAt: Date): Promise<void>;
    findRefreshToken(tokenHash: string): Promise<RowDataPacket | null>;
    revokeRefreshToken(tokenHash: string): Promise<void>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=repository.d.ts.map