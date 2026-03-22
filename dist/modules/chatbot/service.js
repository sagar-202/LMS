"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askChatbot = askChatbot;
// HuggingFace Inference API — OpenAI-compatible chat completions endpoint
const HF_BASE_URL = 'https://router.huggingface.co/hf-inference/v1';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';
const HF_TIMEOUT_MS = 25_000;
/**
 * Build the messages array for the chat completions API.
 */
function buildMessages(message, ctx) {
    if (ctx.courseTitle && ctx.lessonTitle) {
        return [
            {
                role: 'system',
                content: [
                    `You are a dedicated AI tutor for the course "${ctx.courseTitle}", lesson "${ctx.lessonTitle}".`,
                    `You ONLY help based on the lesson content below.`,
                    ``,
                    `LESSON CONTENT:`,
                    ctx.lessonContent || '(Use general knowledge about this lesson topic.)',
                    ``,
                    `STRICT RULES:`,
                    `1. Answer ONLY based on the lesson content and course context.`,
                    `2. If the question is outside this lesson, say: "This is outside the current lesson." Then relate it back.`,
                    `3. Explain step-by-step, use simple language, give course-specific examples.`,
                    `4. Structure: Explanation → Example → Key takeaway.`,
                    `5. Be concise. Do NOT say "as an AI".`,
                ].join('\n'),
            },
            { role: 'user', content: message },
        ];
    }
    return [
        {
            role: 'system',
            content: 'You are a helpful AI assistant for an online Learning Management System called VibeLMS. Answer student questions concisely and clearly.',
        },
        { role: 'user', content: message },
    ];
}
async function askChatbot(message, ctx = {}) {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
        throw new Error('HF_API_KEY is not configured on this server.');
    }
    const messages = buildMessages(message, ctx);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HF_TIMEOUT_MS);
    try {
        const response = await fetch(`${HF_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: HF_MODEL,
                messages,
                max_tokens: 512,
                temperature: 0.7,
                stream: false,
            }),
            signal: controller.signal,
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Hugging Face API error [${response.status}]: ${errorText}`);
        }
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim() ?? '';
        return { reply: reply || 'No response generated.' };
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Chatbot request timed out. Please try again.');
        }
        throw error;
    }
    finally {
        clearTimeout(timeout);
    }
}
//# sourceMappingURL=service.js.map