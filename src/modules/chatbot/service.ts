// HuggingFace Router — featherless-ai provider (OpenAI-compatible, confirmed working)
const HF_API_URL = 'https://router.huggingface.co/featherless-ai/v1/chat/completions';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';
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
                    `You are a dedicated AI tutor for the course "${ctx.courseTitle}", lesson "${ctx.lessonTitle}".`,
                    `LESSON CONTENT: ${ctx.lessonContent || 'Use general knowledge about this topic.'}`,
                    `Rules: Explain step-by-step. Use simple language. Structure: Explanation → Example → Key takeaway.`,
                ].join('\n'),
            },
            { role: 'user', content: message },
        ];
    }
    return [
        {
            role: 'system',
            content: 'You are a helpful AI tutor for VibeLMS, an online Learning Management System. Answer student questions clearly and concisely.',
        },
        { role: 'user', content: message },
    ];
}

export async function askChatbot(message: string, ctx: ChatbotContext = {}): Promise<ChatbotReply> {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
        throw new Error('HF_API_KEY is not configured on this server.');
    }

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
                model: HF_MODEL,
                messages: buildMessages(message, ctx),
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
        return { reply: reply || 'No response generated.' };

    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out — please try again.');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
