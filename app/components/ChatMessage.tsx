"use client";

import { Message } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";
import { User, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatTimestamp } from "@/lib/utils";
import { toast } from "sonner";

interface ChatMessageProps {
    message: Message;
    onRegenerate?: () => void;
    onReaction?: (reaction: "up" | "down") => void;
    disabled?: boolean;
}

export default function ChatMessage({ message, onRegenerate, onReaction, disabled = false }: ChatMessageProps) {
    const [copied, setCopied] = useState(false);
    const [reaction, setReaction] = useState<"up" | "down" | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const isUser = message.role === "user";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            toast.success("Đã sao chép vào clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Không thể sao chép");
        }
    };

    // Memoize markdown components to avoid recreating on each render
    const markdownComponents = useMemo(() => ({
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl !bg-gray-900 !mt-4 !mb-4 text-[13px] shadow-md"
                    {...props}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            ) : (
                <code
                    className="bg-carrot-100/60 dark:bg-gray-700/80 text-carrot-700 dark:text-carrot-300 px-2 py-0.5 rounded-md text-[13px] font-semibold border border-carrot-200/40 dark:border-gray-600/40"
                    {...props}
                >
                    {children}
                </code>
            );
        },
        ul({ node, children, ...props }) {
            return (
                <ul className="list-disc pl-6 my-3 space-y-2" {...props}>
                    {children}
                </ul>
            );
        },
        ol({ node, children, ...props }) {
            return (
                <ol className="list-decimal pl-6 my-3 space-y-2" {...props}>
                    {children}
                </ol>
            );
        },
        li({ node, children, ...props }) {
            return (
                <li className="my-1.5" {...props}>
                    {children}
                </li>
            );
        },
        p({ node, children, ...props }) {
            return (
                <p className="my-2.5 leading-7" {...props}>
                    {children}
                </p>
            );
        },
        h1({ node, children, ...props }) {
            return (
                <h1 className="text-2xl font-extrabold mt-6 mb-3 border-b-2 border-carrot-300 dark:border-carrot-700 pb-2.5 tracking-tight text-gray-900 dark:text-gray-50" {...props}>
                    {children}
                </h1>
            );
        },
        h2({ node, children, ...props }) {
            return (
                <h2 className="text-xl font-extrabold mt-5 mb-3 border-b-2 border-carrot-200 dark:border-carrot-800 pb-2 tracking-tight text-gray-900 dark:text-gray-50" {...props}>
                    {children}
                </h2>
            );
        },
        h3({ node, children, ...props }) {
            return (
                <h3 className="text-lg font-extrabold mt-4 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1.5 tracking-tight text-gray-900 dark:text-gray-50" {...props}>
                    {children}
                </h3>
            );
        },
        blockquote({ node, children, ...props }) {
            return (
                <blockquote className="border-l-4 border-carrot-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-carrot-50 to-transparent dark:from-carrot-900/20 dark:to-transparent py-3 rounded-r-lg shadow-sm" {...props}>
                    {children}
                </blockquote>
            );
        },
        table({ node, children, ...props }) {
            return (
                <div className="overflow-x-auto my-4 rounded-lg shadow-sm">
                    <table className="w-full border-collapse overflow-hidden" {...props}>
                        {children}
                    </table>
                </div>
            );
        },
        th({ node, children, ...props }) {
            return (
                <th className="bg-gradient-to-br from-carrot-100 to-carrot-50 dark:from-carrot-900/30 dark:to-carrot-900/20 font-bold p-3 text-left border border-carrot-200 dark:border-gray-600 text-gray-900 dark:text-gray-50" {...props}>
                    {children}
                </th>
            );
        },
        td({ node, children, ...props }) {
            return (
                <td className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50" {...props}>
                    {children}
                </td>
            );
        },
    }), []);

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className="relative inline-block max-w-[85%]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    initial={hasAnimated ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: hasAnimated ? 0 : 0.3 }}
                    onAnimationComplete={() => setHasAnimated(true)}
                    className={`inline-flex gap-3 px-4 py-0 pt-3 rounded-2xl ${isUser ? "flex-row-reverse" : "flex-row"
                        } ${isUser
                            ? "bg-gradient-to-br from-carrot-500/10 via-carrot-400/5 to-orange-500/10 dark:from-carrot-600/20 dark:via-carrot-500/10 dark:to-orange-600/15 border border-carrot-300/30 dark:border-carrot-600/30 backdrop-blur-sm"
                            : "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/80 border border-gray-200/80 dark:border-gray-700/50 backdrop-blur-sm"
                        } shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-300/60 dark:hover:shadow-gray-900/50 transition-all duration-300`}
                >
                    <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isUser
                            ? "bg-gradient-to-br from-carrot-500 to-carrot-600 text-white"
                            : "bg-white dark:bg-gray-100 border-2 border-carrot-500"
                            }`}
                    >
                        {isUser ? <User className="w-5 h-5" /> : <span className="text-xl">🥕</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-between'}`}>
                            {isUser ? (
                                <div className="flex items-center gap-2.5 flex-row-reverse">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                                        Tôi
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2.5">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                                        Carrot AI
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div>
                            )}

                            {!isUser && onReaction && (
                                <div className="flex items-center gap-1">
                                    <motion.button
                                        onClick={() => {
                                            if (disabled) return;
                                            setReaction(reaction === "up" ? null : "up");
                                            onReaction(reaction === "up" ? "down" : "up");
                                        }}
                                        disabled={disabled}
                                        className={`p-1 rounded-md transition-all ${disabled
                                            ? "opacity-50 cursor-not-allowed text-gray-400"
                                            : reaction === "up"
                                                ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                                                : "text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                            }`}
                                        whileHover={!disabled ? { scale: 1.1 } : {}}
                                        whileTap={!disabled ? { scale: 0.9 } : {}}
                                    >
                                        <ThumbsUp className="w-3 h-3" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => {
                                            if (disabled) return;
                                            setReaction(reaction === "down" ? null : "down");
                                            onReaction(reaction === "down" ? "up" : "down");
                                        }}
                                        disabled={disabled}
                                        className={`p-1 rounded-md transition-all ${disabled
                                            ? "opacity-50 cursor-not-allowed text-gray-400"
                                            : reaction === "down"
                                                ? "text-red-600 bg-red-100 dark:bg-red-900/30"
                                                : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            }`}
                                        whileHover={!disabled ? { scale: 1.1 } : {}}
                                        whileTap={!disabled ? { scale: 0.9 } : {}}
                                    >
                                        <ThumbsDown className="w-3 h-3" />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        <div className={`prose dark:prose-invert max-w-none ${isUser ? 'text-right' : ''}`} style={{ contain: "content" }}>
                            <ReactMarkdown components={markdownComponents}>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons - positioned below message */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-full mt-2 flex items-center gap-1.5 ${isUser ? 'right-0' : 'left-0'}`}
                        >
                            <motion.button
                                onClick={copyToClipboard}
                                disabled={disabled}
                                className={`text-[11px] font-medium flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg shadow-md ${disabled
                                    ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800"
                                    : "text-gray-600 hover:text-carrot-600 dark:text-gray-300 dark:hover:text-carrot-400 bg-white dark:bg-gray-800 hover:bg-carrot-50 dark:hover:bg-carrot-900/30 border border-gray-200 dark:border-gray-700"
                                    }`}
                                whileHover={!disabled ? { scale: 1.05 } : {}}
                                whileTap={!disabled ? { scale: 0.95 } : {}}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Đã sao</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Sao chép</span>
                                    </>
                                )}
                            </motion.button>

                            {!isUser && onRegenerate && (
                                <motion.button
                                    onClick={onRegenerate}
                                    disabled={disabled}
                                    className={`text-[11px] font-medium flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg shadow-md ${disabled
                                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800"
                                        : "text-gray-600 hover:text-carrot-600 dark:text-gray-300 dark:hover:text-carrot-400 bg-white dark:bg-gray-800 hover:bg-carrot-50 dark:hover:bg-carrot-900/30 border border-gray-200 dark:border-gray-700"
                                        }`}
                                    whileHover={!disabled ? { scale: 1.05 } : {}}
                                    whileTap={!disabled ? { scale: 0.95 } : {}}
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Tạo lại</span>
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

