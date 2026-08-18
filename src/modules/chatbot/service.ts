// HuggingFace Inference Router (OpenAI-compatible)
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const PRIMARY_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const FALLBACK_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
const HF_TIMEOUT_MS = 30_000;

export interface ChatbotContext {
    courseTitle?: string;
    lessonTitle?: string;
    lessonContent?: string;
}

export interface ChatbotReply {
    reply: string;
}

interface HFMessage {
    role: 'system' | 'user';
    content: string;
}

function buildMessages(message: string, ctx: ChatbotContext): HFMessage[] {
    if (ctx.courseTitle && ctx.lessonTitle) {
        return [
            {
                role: 'system',
                content: [
                    `You are an educational assistant inside this LMS.`,
                    `Use the supplied course and lesson context to help the student understand the material.`,
                    `Course: ${ctx.courseTitle}`,
                    `Lesson: ${ctx.lessonTitle}`,
                    `Context: ${ctx.lessonContent || 'General lesson topic'}`,
                    `Answer clearly and practically. If the question is related to the lesson, explain it using the lesson context. If the question is unrelated, explain that it is outside the current lesson and redirect the student toward the course topic. Do not fabricate information that is not supported by the supplied context. Use examples when useful. Keep the response concise unless the student asks for more detail.`,
                ].join('\n'),
            },
            { role: 'user', content: message },
        ];
    }
    return [
        {
            role: 'system',
            content: 'You are an educational assistant inside this LMS. Answer student questions clearly and concisely using practical examples.',
        },
        { role: 'user', content: message },
    ];
}

async function fetchFromHF(model: string, apiKey: string, messages: HFMessage[]): Promise<string> {
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
                model,
                messages,
                max_tokens: 400,
                temperature: 0.7,
                stream: false,
            }),
            signal: controller.signal,
        });

        const rawText = await response.text().catch(() => '');

        if (!response.ok) {
            throw new Error(`AI API error [${response.status}]: ${rawText.slice(0, 300)}`);
        }

        let data: unknown;
        try {
            data = JSON.parse(rawText);
        } catch {
            throw new Error(`AI API returned non-JSON: ${rawText.slice(0, 200)}`);
        }

        const parsed = data as { choices?: Array<{ message?: { content?: string } }> };
        const reply = parsed.choices?.[0]?.message?.content?.trim() ?? '';
        return reply;
    } finally {
        clearTimeout(timeout);
    }
}

export async function askChatbot(message: string, ctx: ChatbotContext = {}): Promise<ChatbotReply> {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
        throw new Error('HF_API_KEY is not configured on this server.');
    }

    const messages = buildMessages(message, ctx);

    try {
        const reply = await fetchFromHF(PRIMARY_MODEL, apiKey, messages);
        return { reply: reply || 'No response generated.' };
    } catch (primaryError) {
        console.warn(`Primary model (${PRIMARY_MODEL}) failed:`, primaryError instanceof Error ? primaryError.message : primaryError);
        try {
            const fallbackReply = await fetchFromHF(FALLBACK_MODEL, apiKey, messages);
            return { reply: fallbackReply || 'No response generated.' };
        } catch (fallbackError) {
            if (primaryError instanceof Error && primaryError.name === 'AbortError') {
                throw new Error('Request timed out — please try again.');
            }
            throw primaryError;
        }
    }
}

