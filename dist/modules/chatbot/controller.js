"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotController = void 0;
const service_1 = require("./service");
exports.chatbotController = {
    async chat(req, res) {
        const { message, courseTitle, lessonTitle, lessonContent } = req.body;
        if (typeof message !== 'string' || message.trim().length === 0) {
            res.status(400).json({ success: false, message: 'message must be a non-empty string.' });
            return;
        }
        // Build context object only with defined string values
        // (exactOptionalPropertyTypes forbids explicit `undefined` assignment)
        const ctx = {};
        if (typeof courseTitle === 'string')
            ctx.courseTitle = courseTitle;
        if (typeof lessonTitle === 'string')
            ctx.lessonTitle = lessonTitle;
        if (typeof lessonContent === 'string')
            ctx.lessonContent = lessonContent;
        try {
            const result = await (0, service_1.askChatbot)(message.trim(), ctx);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : 'Internal server error';
            const status = msg.includes('timed out') ? 504 : 502;
            res.status(status).json({ success: false, message: msg });
        }
    }
};
//# sourceMappingURL=controller.js.map