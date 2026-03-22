import { create } from 'zustand';

export interface ChatbotContext {
    courseTitle: string;
    lessonTitle: string;
    lessonContent: string;
}

interface ChatbotContextState {
    context: ChatbotContext | null;
    setContext: (ctx: ChatbotContext) => void;
    clearContext: () => void;
}

/**
 * Zustand store that lesson pages write to so the floating chatbot
 * knows which course/lesson the student is currently viewing.
 */
export const useChatbotContextStore = create<ChatbotContextState>((set) => ({
    context: null,
    setContext: (ctx) => set({ context: ctx }),
    clearContext: () => set({ context: null }),
}));
