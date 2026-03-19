export interface Enrollment {
    user_id: number;
    subject_id: number;
    enrolled_at: Date;
}
export declare class EnrollmentRepository {
    enrollUser(userId: number, subjectId: number): Promise<void>;
    getEnrollmentsByUserId(userId: number): Promise<number[]>;
    isUserEnrolled(userId: number, subjectId: number): Promise<boolean>;
}
export declare const enrollmentRepository: EnrollmentRepository;
//# sourceMappingURL=repository.d.ts.map