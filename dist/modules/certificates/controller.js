"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificatesController = exports.CertificatesController = void 0;
const service_1 = require("./service");
class CertificatesController {
    generate = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const subjectId = parseInt(req.params.subjectId);
            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            if (isNaN(subjectId)) {
                return res.status(400).json({ message: 'Invalid subject ID' });
            }
            const certificate = await service_1.certificatesService.generateCertificate(userId, subjectId);
            res.status(201).json({
                success: true,
                data: certificate
            });
        }
        catch (error) {
            next(error);
        }
    };
    getMyCertificates = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const certificates = await service_1.certificatesService.getMyCertificates(userId);
            res.status(200).json({
                success: true,
                data: certificates
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CertificatesController = CertificatesController;
exports.certificatesController = new CertificatesController();
//# sourceMappingURL=controller.js.map