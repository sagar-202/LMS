export type UserRole = 'student' | 'instructor' | 'admin';
export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}
export declare class UserRepository {
    /**
     * Example: Find a user by their email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Example: Return all users
     */
    findAll(): Promise<User[]>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=repository.d.ts.map