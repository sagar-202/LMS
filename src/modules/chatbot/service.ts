const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const HF_TIMEOUT_MS = 20_000; // 20 second timeout

export interface ChatbotReply {
    reply: string;
}

export async function askChatbot(message: string): Promise<ChatbotReply> {
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
            body: JSON.stringify({ inputs: message }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Hugging Face API error [${response.status}]: ${errorText}`);
        }

        const data = await response.json() as unknown;

        // The HF Inference API returns an array: [{ generated_text: "..." }]
        if (Array.isArray(data) && data.length > 0) {
            const first = data[0] as { generated_text?: string };
            const rawText = first.generated_text ?? '';
            // Strip the original prompt from the reply if the model echoes it back
            const reply = rawText.startsWith(message)
                ? rawText.slice(message.length).trim()
                : rawText.trim();
            return { reply: reply || 'No response generated.' };
        }

        return { reply: 'No response generated.' };
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Chatbot request timed out. Please try again.');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
