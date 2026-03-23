// HuggingFace Inference API — OpenAI-compatible chat completions endpoint
const HF_BASE_URL = 'https://router.huggingface.co/hf-inference/v1';
const HF_MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // reliable, free-tier serverless model
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

/**
 * Build the messages array for the chat completions API.
 */
function buildMessages(message: string, ctx: ChatbotContext): HFMessage[] {
    if (ctx.courseTitle && ctx.lessonTitle) {
        return [
            {
                role: 'system',
                content: [
                    `You are a dedicated AI tutor for the course "${ctx.courseTitle}", lesson "${ctx.lessonTitle}".`,
                    `Answer ONLY based on the lesson content below.`,
                    ``,
                    `LESSON CONTENT: ${ctx.lessonContent || 'Use general knowledge about this topic.'}`,
                    ``,
                    `Rules: Explain step-by-step. Use simple language. Give course-specific examples.`,
                    `Structure every answer as: Explanation → Example → Key takeaway.`,
                ].join('\n'),
            },
            { role: 'user', content: message },
        ];
    }

    return [
        {
            role: 'system',
            content: 'You are a helpful AI assistant for VibeLMS, an online Learning Management System. Answer student questions clearly and concisely.',
        },
        { role: 'user', content: message },
    ];
}

export async function askChatbot(message: string, ctx: ChatbotContext = {}): Promise<ChatbotReply> {
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
                max_tokens: 400,
                temperature: 0.7,
                stream: false,
            }),
            signal: controller.signal,
        });

        // Read body once regardless of status
        const rawText = await response.text().catch(() => '');

        if (!response.ok) {
            throw new Error(`HF API error [${response.status}]: ${rawText.slice(0, 300)}`);
        }

        let data: unknown;
        try {
            data = JSON.parse(rawText);
        } catch {
            throw new Error(`HF API returned non-JSON response: ${rawText.slice(0, 200)}`);
        }

        const parsed = data as {
            choices?: Array<{ message?: { content?: string } }>;
        };
        const reply = parsed.choices?.[0]?.message?.content?.trim() ?? '';
        return { reply: reply || 'No response generated.' };

    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out — the AI model took too long. Please try again.');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
