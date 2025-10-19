"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";
import ScrollToBottom from "./ScrollToBottom";
import ExportChat from "./ExportChat";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, MessageSquare, StopCircle, Menu, Plus } from "lucide-react";
import { toast } from "sonner";

interface ChatContainerProps {
    initialMessages: Message[];
    onMessagesChange: (messages: Message[]) => void;
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
    onClearChat?: () => void; // Callback to delete current session
    onNewChat?: () => void; // Callback to create new chat
}

export default function ChatContainer({
    initialMessages,
    onMessagesChange,
    sidebarOpen,
    onToggleSidebar,
    onClearChat,
    onNewChat,
}: ChatContainerProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const isAutoScrolling = useRef(true); // Track if user is at bottom
    const previousScrollHeight = useRef(0);

    // Initialize messages from props only once
    useEffect(() => {
        if (isInitialMount.current) {
            setMessages(initialMessages);
            isInitialMount.current = false;
        }
    }, []);

    // Optimized auto-scroll: only scroll if user is near bottom
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

        // Only auto-scroll if user is near bottom or it's the initial load
        if (isNearBottom || isAutoScrolling.current) {
            // Use requestAnimationFrame for smoother scrolling during streaming
            requestAnimationFrame(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
                }
            });
        }

        previousScrollHeight.current = scrollHeight;
    }, [messages, isLoading]);

    // Handle scroll detection for scroll-to-bottom button
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
            setShowScrollButton(!isNearBottom && messages.length > 3);

            // Update auto-scroll flag based on user's scroll position
            isAutoScrolling.current = isNearBottom;
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [messages.length]);

    const scrollToBottom = () => {
        isAutoScrolling.current = true; // Re-enable auto-scrolling
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const stopGeneration = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsLoading(false);
            toast.info("Generation stopped");
        }
    };

    const sendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        // Create abort controller for stop generation
        const controller = new AbortController();
        setAbortController(controller);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to get response");
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "",
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);
                            if (data === "[DONE]") {
                                break;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.text) {
                                    accumulatedText += parsed.text;
                                    setMessages((prev) => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1] = {
                                            ...newMessages[newMessages.length - 1],
                                            content: accumulatedText,
                                        };
                                        return newMessages;
                                    });
                                }
                            } catch (e) {
                                // Ignore parse errors
                            }
                        }
                    }
                }
            }

            // Notify parent after successful message exchange
            // Use setTimeout to ensure state is updated before notifying parent
            setTimeout(() => {
                setMessages((prev) => {
                    onMessagesChange(prev);
                    return prev;
                });
            }, 0);
        } catch (error: any) {
            console.error("Chat error:", error);
            if (error.name === "AbortError") {
                // User stopped generation - don't show error
                return;
            }
            toast.error(error.message || "Failed to send message", {
                action: {
                    label: "Retry",
                    onClick: () => sendMessage(content),
                },
            });
            // Remove the user message if there was an error
            setMessages((prev) => {
                const rollback = prev.slice(0, -1);
                onMessagesChange(rollback);
                return rollback;
            });
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const handleRegenerate = () => {
        if (messages.length < 2) return;

        // Get the last user message
        const lastUserMessage = [...messages]
            .reverse()
            .find((msg) => msg.role === "user");

        if (lastUserMessage) {
            // Remove the last assistant message
            setMessages((prev) => prev.slice(0, -1));
            // Resend the last user message
            sendMessage(lastUserMessage.content);
        }
    };

    const handleReaction = (messageId: string, reaction: "up" | "down") => {
        // You can implement reaction storage here
        toast.success(`Reaction ${reaction === "up" ? "👍" : "👎"} recorded!`);
    };

    const handleClearChat = () => {
        if (messages.length > 0) {
            setShowClearDialog(true);
        }
    };

    const confirmClearChat = () => {
        setShowClearDialog(false);
        if (onClearChat) {
            // Delete the entire session
            onClearChat();
            toast.success("Đã xóa cuộc trò chuyện");
        } else {
            // Fallback: just clear messages
            setMessages([]);
            onMessagesChange([]);
            toast.success("Đã xóa toàn bộ tin nhắn");
        }
    };

    return (
        <>
            <div className="h-full flex flex-col bg-gradient-to-br from-carrot-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
                {/* Header with Toggle Sidebar and New Chat buttons */}
                <div className="flex-shrink-0 px-4 pt-4">
                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={onToggleSidebar}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-carrot-600 dark:hover:text-carrot-400 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {sidebarOpen ? "Ẩn lịch sử" : "Hiện lịch sử"}
                            </span>
                        </motion.button>

                        {onNewChat && !sidebarOpen && messages.length > 0 && (
                            <motion.button
                                onClick={onNewChat}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isLoading
                                    ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600 bg-gray-200 dark:bg-gray-700"
                                    : "text-white bg-gradient-to-r from-carrot-500 to-carrot-600 hover:from-carrot-600 hover:to-carrot-700 shadow-md"
                                    }`}
                                whileHover={!isLoading ? { scale: 1.05 } : {}}
                                whileTap={!isLoading ? { scale: 0.95 } : {}}
                            >
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">Chat mới</span>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Messages Container - Fixed height with scroll */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto px-4 py-6"
                        style={{
                            scrollbarGutter: "stable",
                            willChange: isLoading ? "scroll-position" : "auto",
                            contain: "layout style paint"
                        }}
                    >
                        <div className="max-w-4xl mx-auto space-y-4">
                            <AnimatePresence>
                                {messages.length === 0 && !isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex flex-col items-center justify-center min-h-[280px] text-center"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-carrot-400 to-carrot-600 text-white mb-5 shadow-xl">
                                            <MessageSquare className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            Chào mừng đến Carrot Chat
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mb-6">
                                            Bắt đầu cuộc trò chuyện và để AI hỗ trợ bạn
                                        </p>
                                        <SuggestedPrompts onSelect={sendMessage} disabled={isLoading} />
                                    </motion.div>
                                )}

                                {messages.map((message, index) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        onRegenerate={
                                            message.role === "assistant" &&
                                                index === messages.length - 1 &&
                                                !isLoading
                                                ? handleRegenerate
                                                : undefined
                                        }
                                        onReaction={(reaction) => handleReaction(message.id, reaction)}
                                        disabled={isLoading}
                                    />
                                ))}
                            </AnimatePresence>

                            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 mr-auto max-w-[85%] border border-gray-200 dark:border-gray-700 shadow-sm"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-100 border-2 border-carrot-500 flex items-center justify-center shadow-sm">
                                        <span className="text-base">🥕</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-carrot-500" />
                                        <span className="text-[13px] text-gray-600 dark:text-gray-400">
                                            Thinking...
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {messages.length > 0 && (
                        <div className="flex-shrink-0 px-4 pb-3">
                            <div className="max-w-4xl mx-auto flex justify-between items-center">
                                <ExportChat messages={messages} disabled={isLoading} />
                                <motion.button
                                    onClick={handleClearChat}
                                    disabled={isLoading}
                                    className={`text-[12px] flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border ${isLoading
                                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600 border-transparent"
                                        : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-transparent hover:border-red-200 dark:hover:border-red-900/40"
                                        }`}
                                    whileHover={!isLoading ? { scale: 1.03 } : {}}
                                    whileTap={!isLoading ? { scale: 0.97 } : {}}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Clear Chat</span>
                                </motion.button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stop Generation Button */}
                {isLoading && (
                    <div className="flex-shrink-0 px-4 pb-3">
                        <div className="max-w-4xl mx-auto flex justify-center">
                            <motion.button
                                onClick={stopGeneration}
                                className="text-[12px] text-white bg-red-500 hover:bg-red-600 flex items-center gap-1.5 transition-colors px-4 py-2 rounded-lg shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <StopCircle className="w-4 h-4" />
                                <span>Stop Generation</span>
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Input Area - Fixed at bottom */}
                <div className="flex-shrink-0">
                    <ChatInput onSend={sendMessage} disabled={isLoading} />
                </div>
            </div>

            {/* Scroll to Bottom Button */}
            <ScrollToBottom visible={showScrollButton} onClick={scrollToBottom} />

            {/* Clear Chat Confirmation Dialog */}
            <AnimatePresence>
                {showClearDialog && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setShowClearDialog(false)}
                        />

                        {/* Dialog */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
                            >
                                {/* Icon */}
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
                                    <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
                                    Xóa cuộc trò chuyện?
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                    Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.
                                </p>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={() => setShowClearDialog(false)}
                                        className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Hủy
                                    </motion.button>
                                    <motion.button
                                        onClick={confirmClearChat}
                                        className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Xóa
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

