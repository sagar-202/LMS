export interface Certificate {
    id: number;
    user_id: number;
    subject_id: number;
    issued_at: Date;
    certificate_url: string;
    subject_title?: string;
}
export declare class CertificatesRepository {
    create(userId: number, subjectId: number, url: string): Promise<Certificate>;
    findByUserAndSubject(userId: number, subjectId: number): Promise<Certificate | null>;
    findByUserId(userId: number): Promise<Certificate[]>;
}
export declare const certificatesRepository: CertificatesRepository;
//# sourceMappingURL=repository.d.ts.map