import { Request, Response } from 'express';
import { askChatbot, ChatbotContext } from './service';

export const chatbotController = {
    async chat(req: Request, res: Response): Promise<void> {
        const { message, courseTitle, lessonTitle, lessonContent } = req.body as {
            message?: unknown;
            courseTitle?: unknown;
            lessonTitle?: unknown;
            lessonContent?: unknown;
        };

        if (typeof message !== 'string' || message.trim().length === 0) {
            res.status(400).json({ success: false, message: 'message must be a non-empty string.' });
            return;
        }

        // Build context object only with defined string values
        // (exactOptionalPropertyTypes forbids explicit `undefined` assignment)
        const ctx: ChatbotContext = {};
        if (typeof courseTitle === 'string') ctx.courseTitle = courseTitle;
        if (typeof lessonTitle === 'string') ctx.lessonTitle = lessonTitle;
        if (typeof lessonContent === 'string') ctx.lessonContent = lessonContent;

        try {
            const result = await askChatbot(message.trim(), ctx);
            res.status(200).json({ success: true, ...result });
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Internal server error';
            const status = msg.includes('timed out') ? 504 : 502;
            res.status(status).json({ success: false, message: msg });
        }
    }
};
