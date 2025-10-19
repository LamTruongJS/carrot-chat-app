"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileJson } from "lucide-react";
import { Message } from "@/types/chat";
import { toast } from "sonner";

interface ExportChatProps {
    messages: Message[];
    disabled?: boolean;
}

export default function ExportChat({ messages, disabled = false }: ExportChatProps) {
    const exportAsText = () => {
        if (disabled) return;
        if (messages.length === 0) {
            toast.error("No messages to export");
            return;
        }

        const text = messages
            .map((msg) => {
                const timestamp = new Date(msg.timestamp).toLocaleString();
                const role = msg.role === "user" ? "You" : "Carrot AI";
                return `[${timestamp}] ${role}:\n${msg.content}\n`;
            })
            .join("\n---\n\n");

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `carrot-chat-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Chat exported as TXT");
    };

    const exportAsJson = () => {
        if (disabled) return;
        if (messages.length === 0) {
            toast.error("No messages to export");
            return;
        }

        const json = JSON.stringify(messages, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `carrot-chat-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Chat exported as JSON");
    };

    if (messages.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <motion.button
                onClick={exportAsText}
                disabled={disabled}
                className={`text-[12px] flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border ${disabled
                    ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-carrot-600 dark:hover:text-carrot-400 hover:bg-carrot-50 dark:hover:bg-carrot-900/20 border-transparent hover:border-carrot-200 dark:hover:border-carrot-800"
                    }`}
                whileHover={!disabled ? { scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
            >
                <FileText className="w-3.5 h-3.5" />
                <span>Export TXT</span>
            </motion.button>

            <motion.button
                onClick={exportAsJson}
                disabled={disabled}
                className={`text-[12px] flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border ${disabled
                    ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-carrot-600 dark:hover:text-carrot-400 hover:bg-carrot-50 dark:hover:bg-carrot-900/20 border-transparent hover:border-carrot-200 dark:hover:border-carrot-800"
                    }`}
                whileHover={!disabled ? { scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
            >
                <FileJson className="w-3.5 h-3.5" />
                <span>Export JSON</span>
            </motion.button>
        </div>
    );
}

