export declare class CertificatesService {
    private readonly UPLOADS_DIR;
    constructor();
    generateCertificate(userId: number, subjectId: number): Promise<import("./repository").Certificate>;
    getMyCertificates(userId: number): Promise<import("./repository").Certificate[]>;
    private createPdf;
}
export declare const certificatesService: CertificatesService;
//# sourceMappingURL=service.d.ts.map