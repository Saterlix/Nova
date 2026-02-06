"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Send, MessagesSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChatWindow } from "./chat-window";

export function ChatWidget() {
    const telegramLink = "https://t.me/Nova_BusinessBOT";
    const phoneNumber = "+998507037750";

    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <>
            <AnimatePresence>
                {isChatOpen && (
                    <ChatWindow onClose={() => setIsChatOpen(false)} />
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <Button
                                size="icon"
                                onClick={toggleOpen}
                                className={`h-14 w-14 rounded-full shadow-xl transition-all hover:scale-110 ${isOpen ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                            >
                                {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
                            </Button>
                        </motion.div>
                    </PopoverTrigger>

                    <PopoverContent side="top" align="end" className="w-56 p-2 flex flex-col gap-2 bg-background/95 backdrop-blur-sm shadow-2xl border-border mb-2">
                        <Button
                            variant="ghost"
                            className="justify-start gap-3 w-full"
                            onClick={() => {
                                setIsChatOpen(true);
                                setIsOpen(false);
                            }}
                        >
                            <MessagesSquare className="w-5 h-5 text-primary" />
                            <span>Онлайн чат</span>
                        </Button>

                        <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button variant="ghost" className="justify-start gap-3 w-full">
                                <Send className="w-5 h-5 text-blue-500" />
                                <span>Telegram Bot</span>
                            </Button>
                        </a>

                        <a href={`tel:${phoneNumber}`} className="w-full">
                            <Button variant="ghost" className="justify-start gap-3 w-full">
                                <Phone className="w-5 h-5 text-green-500" />
                                <span>Позвонить</span>
                            </Button>
                        </a>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}
