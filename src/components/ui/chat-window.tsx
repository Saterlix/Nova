"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface Message {
    id: number;
    text: string;
    from: 'user' | 'support';
}

export function ChatWindow({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: "Здравствуйте! Чем можем помочь?", from: 'support' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastMessageIdRef = useRef<number>(0);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/chat/poll');
                const data = await res.json();

                if (data.updates && Array.isArray(data.updates)) {
                    const newMessages = data.updates.filter((msg: Message) => {
                        // Very basic dedup: only take messages newer than we've 'seen' 
                        // Note: In a real app we'd track IDs more robustly.
                        // For this MVP, we just check if it's already in our local state to avoid flickering
                        // But since we don't persist 'user' messages in backend for this MVP poll, 
                        // we mainly check if we already have this support msg ID.
                        return !messages.some(m => m.id === msg.id) && msg.id > lastMessageIdRef.current;
                    });

                    if (newMessages.length > 0) {
                        setMessages(prev => {
                            // Deduplicate against current state again to be safe
                            const uniqueNew = newMessages.filter((nm: Message) => !prev.some(pm => pm.id === nm.id));
                            if (uniqueNew.length === 0) return prev;

                            uniqueNew.forEach((m: Message) => {
                                if (m.id > lastMessageIdRef.current) lastMessageIdRef.current = m.id;
                            });
                            return [...prev, ...uniqueNew];
                        });
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const text = inputValue;
        setInputValue("");

        // Optimistic UI update
        const tempId = Date.now();
        setMessages(prev => [...prev, { id: tempId, text, from: 'user' }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!res.ok) {
                // Handle error (maybe mark message as failed)
                console.error("Failed to send");
            }
        } catch (e) {
            console.error("Send error", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 z-50 w-[90vw] md:w-[350px] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden h-[500px]"
        >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-bold">Support Online</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/80 text-primary-foreground h-8 w-8">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-muted/30">
                <div className="flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.from === 'user'
                                    ? 'bg-primary text-primary-foreground self-end rounded-tr-none'
                                    : 'bg-muted border border-border self-start rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border bg-background flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Напишите сообщение..."
                    className="flex-1"
                />
                <Button onClick={handleSend} size="icon" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </motion.div>
    );
}
