'use client';

import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
    id: number;
    role: 'user' | 'ai';
    text: string;
}

interface ChatbotResponse {
    reply: string;
}

// ─── Icons (inline SVG to avoid extra dependencies) ──────────────────────────

const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M12 11V3" />
        <circle cx="12" cy="3" r="1" fill="currentColor" />
        <path d="M8 15h.01M12 15h.01M16 15h.01" strokeWidth="3" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"
        strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ─── Typing indicator ────────────────────────────────────────────────────────

const TypingDots = () => (
    <div className="flex gap-1 items-center py-1">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </div>
);

// ─── Component ───────────────────────────────────────────────────────────────

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, role: 'ai', text: '👋 Hi! I\'m your VibeLMS AI assistant. Ask me anything about your courses!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input when chat opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [open]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const data = await apiFetch<ChatbotResponse>('/chatbot', {
                method: 'POST',
                body: JSON.stringify({ message: text }),
            });

            const aiMsg: Message = {
                id: Date.now() + 1,
                role: 'ai',
                text: data.reply || 'Sorry, I didn\'t get a response. Please try again.'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            const errMsg: Message = {
                id: Date.now() + 1,
                role: 'ai',
                text: '⚠️ Sorry, I ran into an issue. Please try again in a moment.'
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* ── Chat Popup ── */}
            {open && (
                <div
                    className="fixed bottom-24 right-5 sm:right-8 z-50 w-[360px] max-w-[calc(100vw-2.5rem)] flex flex-col rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.55)] overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ height: '460px' }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
                        <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
                            <BotIcon />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm tracking-tight">VibeLMS AI</p>
                            <p className="text-[11px] text-blue-100 font-medium">Powered by Mistral</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-xl flex items-center justify-center transition-colors"
                            aria-label="Close chat"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'ai' && (
                                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 text-white">
                                        <BotIcon />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                                    <BotIcon />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                    <TypingDots />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything..."
                                disabled={loading}
                                className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none disabled:opacity-50"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
                                aria-label="Send message"
                            >
                                <SendIcon />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-2">
                            Press <kbd className="font-bold">Enter</kbd> to send
                        </p>
                    </div>
                </div>
            )}

            {/* ── Floating Toggle Button ── */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className={`
                    fixed bottom-5 right-5 sm:right-8 z-50
                    w-14 h-14 rounded-full
                    bg-gradient-to-br from-blue-600 to-indigo-600
                    hover:from-blue-700 hover:to-indigo-700
                    text-white shadow-[0_8px_30px_rgba(79,70,229,0.5)]
                    hover:shadow-[0_12px_40px_rgba(79,70,229,0.7)]
                    flex items-center justify-center
                    transition-all duration-300
                    hover:scale-110 active:scale-95
                    ${open ? 'rotate-180' : 'rotate-0'}
                `}
                aria-label={open ? 'Close chatbot' : 'Open chatbot'}
            >
                {open ? <CloseIcon /> : <BotIcon />}
            </button>
        </>
    );
}
