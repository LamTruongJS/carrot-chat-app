"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                120
            )}px`;
        }
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md py-4 px-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 shadow-md border border-gray-300 dark:border-gray-600 hover:border-carrot-400 dark:hover:border-carrot-500 focus-within:border-carrot-500 dark:focus-within:border-carrot-400 transition-all">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        disabled={disabled}
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 max-h-[120px] disabled:opacity-50 text-[15px] leading-6 py-1"
                    />
                    <motion.button
                        onClick={handleSubmit}
                        disabled={disabled || !input.trim()}
                        className={`flex-shrink-0 p-2 rounded-lg transition-all ${disabled || !input.trim()
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-carrot-500 to-carrot-600 text-white hover:from-carrot-600 hover:to-carrot-700 shadow-md hover:shadow-lg"
                            }`}
                        whileHover={!disabled && input.trim() ? { scale: 1.05 } : {}}
                        whileTap={!disabled && input.trim() ? { scale: 0.95 } : {}}
                        aria-label="Send message"
                    >
                        {disabled ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </motion.button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-medium">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-medium">Shift+Enter</kbd> for new line
                        </p>
                        {input.length > 0 && (
                            <span className={`text-[10px] font-medium ${input.length > 5000 ? "text-red-500" :
                                    input.length > 3000 ? "text-yellow-600" :
                                        "text-gray-400 dark:text-gray-500"
                                }`}>
                                {input.length} / 10000
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <span className="opacity-60">Created by</span>
                        <span className="font-medium text-carrot-600 dark:text-carrot-400">Lê Lâm Trường</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

