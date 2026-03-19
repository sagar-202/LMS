import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { certificatesRepository } from './repository';
import { progressService } from '../progress/service';
import { subjectsRepository } from '../subjects/repository';
import { userRepository } from '../users/repository';

export class CertificatesService {
    private readonly UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'certificates');

    constructor() {
        if (!fs.existsSync(this.UPLOADS_DIR)) {
            fs.mkdirSync(this.UPLOADS_DIR, { recursive: true });
        }
    }

    async generateCertificate(userId: number, subjectId: number) {
        // 1. Check if already exists
        const existing = await certificatesRepository.findByUserAndSubject(userId, subjectId);
        if (existing) {
            return existing;
        }

        // 2. Verify completion
        const progress = await progressService.getSubjectProgress(userId, subjectId);
        if (progress.percent_complete < 100) {
            throw { statusCode: 400, message: `Course not completed. Progress: ${progress.percent_complete}%` };
        }

        // 3. Get User and Subject details
        const subject = await subjectsRepository.getPublishedSubjectById(subjectId);
        const [rows] = await require('../../config/db').default.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = (rows as any)[0];

        if (!subject || !user) {
            throw { statusCode: 404, message: 'Subject or User not found' };
        }

        // 4. Generate PDF
        const fileName = `certificate_${userId}_${subjectId}_${Date.now()}.pdf`;
        const filePath = path.join(this.UPLOADS_DIR, fileName);
        const publicUrl = `/uploads/certificates/${fileName}`;

        await this.createPdf(user.name, subject.title, filePath);

        // 5. Store in DB
        return await certificatesRepository.create(userId, subjectId, publicUrl);
    }

    async getMyCertificates(userId: number) {
        return await certificatesRepository.findByUserId(userId);
    }

    private createPdf(userName: string, subjectTitle: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
            });

            const stream = fs.createWriteStream(filePath);
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

export const certificatesService = new CertificatesService();
