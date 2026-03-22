"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askChatbot = askChatbot;
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const HF_TIMEOUT_MS = 20_000;
/**
 * Build an instructional prompt scoped to the student's current lesson.
 * Falls back to a general LMS assistant prompt when no lesson context is given.
 */
function buildPrompt(message, ctx) {
    if (ctx.courseTitle && ctx.lessonTitle) {
        return `<s>[INST]
You are a dedicated AI tutor for the course "${ctx.courseTitle}", lesson "${ctx.lessonTitle}".
You ONLY help based on the lesson content below.

LESSON CONTENT:
${ctx.lessonContent || '(No content provided — use general knowledge about the lesson topic.)'}

STRICT RULES:
1. Answer ONLY based on the lesson content and course context.
2. If the question is outside this lesson, respond: "This question is outside the current lesson. Let me guide you based on what you are learning." Then connect it back.
3. Always explain step-by-step, use simple language, and give examples related to THIS course.
4. Structure: Explanation → Example → Key takeaway.
5. Do NOT say "as an AI model". Keep answers concise.

STUDENT QUESTION:
${message}

FINAL ANSWER: [/INST]`;
    }
    // Generic fallback — no lesson context
    return `<s>[INST]
You are a helpful AI assistant for an online Learning Management System called VibeLMS.
Answer the following student question concisely and clearly:

${message}
[/INST]`;
}
async function askChatbot(message, ctx = {}) {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
        throw new Error('HF_API_KEY is not configured on this server.');
    }
    const prompt = buildPrompt(message, ctx);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HF_TIMEOUT_MS);
    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 512,
                    temperature: 0.7,
                    return_full_text: false, // only return generated text, not the echoed prompt
                },
            }),
            signal: controller.signal,
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Hugging Face API error [${response.status}]: ${errorText}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            const first = data[0];
            const reply = (first.generated_text ?? '').trim();
            return { reply: reply || 'No response generated.' };
        }
        return { reply: 'No response generated.' };
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