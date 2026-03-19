"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificatesService = exports.CertificatesService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const repository_1 = require("./repository");
const service_1 = require("../progress/service");
const repository_2 = require("../subjects/repository");
class CertificatesService {
    UPLOADS_DIR = path_1.default.join(process.cwd(), 'uploads', 'certificates');
    constructor() {
        if (!fs_1.default.existsSync(this.UPLOADS_DIR)) {
            fs_1.default.mkdirSync(this.UPLOADS_DIR, { recursive: true });
        }
    }
    async generateCertificate(userId, subjectId) {
        // 1. Check if already exists
        const existing = await repository_1.certificatesRepository.findByUserAndSubject(userId, subjectId);
        if (existing) {
            return existing;
        }
        // 2. Verify completion
        const progress = await service_1.progressService.getSubjectProgress(userId, subjectId);
        if (progress.percent_complete < 100) {
            throw { statusCode: 400, message: `Course not completed. Progress: ${progress.percent_complete}%` };
        }
        // 3. Get User and Subject details
        const subject = await repository_2.subjectsRepository.getPublishedSubjectById(subjectId);
        const [rows] = await require('../../config/db').default.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = rows[0];
        if (!subject || !user) {
            throw { statusCode: 404, message: 'Subject or User not found' };
        }
        // 4. Generate PDF
        const fileName = `certificate_${userId}_${subjectId}_${Date.now()}.pdf`;
        const filePath = path_1.default.join(this.UPLOADS_DIR, fileName);
        const publicUrl = `/uploads/certificates/${fileName}`;
        await this.createPdf(user.name, subject.title, filePath);
        // 5. Store in DB
        return await repository_1.certificatesRepository.create(userId, subjectId, publicUrl);
    }
    async getMyCertificates(userId) {
        return await repository_1.certificatesRepository.findByUserId(userId);
    }
    createPdf(userName, subjectTitle, filePath) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                layout: 'landscape',
                size: 'A4',
            });
            const stream = fs_1.default.createWriteStream(filePath);
            doc.pipe(stream);
            // Add background border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
            // Content
            doc.moveDown(5);
            doc.fontSize(60).text('CERTIFICATE', { align: 'center' });
            doc.fontSize(20).text('OF COMPLETION', { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(15).text('This is to certify that', { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(40).text(userName, { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(15).text('has successfully completed the course', { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(30).text(subjectTitle, { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(12).text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });
            doc.end();
            stream.on('finish', () => resolve());
            stream.on('error', (err) => reject(err));
        });
    }
}
exports.CertificatesService = CertificatesService;
exports.certificatesService = new CertificatesService();
//# sourceMappingURL=service.js.map