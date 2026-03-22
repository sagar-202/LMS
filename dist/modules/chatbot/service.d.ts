export interface ChatbotContext {
    courseTitle?: string;
    lessonTitle?: string;
    lessonContent?: string;
}
export interface ChatbotReply {
    reply: string;
}
export declare function askChatbot(message: string, ctx?: ChatbotContext): Promise<ChatbotReply>;
//# sourceMappingURL=service.d.ts.map