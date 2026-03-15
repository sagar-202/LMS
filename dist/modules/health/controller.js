"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
class HealthController {
    getHealth = (req, res) => {
        res.status(200).json({
            success: true,
            data: { status: 'ok', timestamp: new Date().toISOString() }
        });
    };
}
exports.HealthController = HealthController;
exports.healthController = new HealthController();
//# sourceMappingURL=controller.js.map