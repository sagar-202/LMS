export declare class EnrollmentService {
    enrollUser(userId: number, subjectId: number): Promise<void>;
    getUserEnrollments(userId: number): Promise<number[]>;
    isUserEnrolled(userId: number, subjectId: number): Promise<boolean>;
}
export declare const enrollmentService: EnrollmentService;
//# sourceMappingURL=service.d.ts.map