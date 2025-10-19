"use client";

import { ChatSession } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2, Edit2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SidebarProps {
    sessions: ChatSession[];
    currentSessionId: string;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    onDeleteSession: (sessionId: string) => void;
    onRenameSession: (sessionId: string, newTitle: string) => void;
}

export default function Sidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    onRenameSession,
}: SidebarProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const handleStartEdit = (session: ChatSession) => {
        setEditingId(session.id);
        setEditTitle(session.title);
        setMenuOpenId(null);
    };

    const handleSaveEdit = (sessionId: string) => {
        if (editTitle.trim()) {
            onRenameSession(sessionId, editTitle.trim());
            toast.success("Đã đổi tên");
        }
        setEditingId(null);
    };

    const handleDelete = (sessionId: string) => {
        setMenuOpenId(null);
        onDeleteSession(sessionId);
    };

    const getSessionPreview = (session: ChatSession) => {
        if (session.messages.length === 0) return "Cuộc trò chuyện mới";
        const firstUserMessage = session.messages.find((msg) => msg.role === "user");
        return firstUserMessage?.content.slice(0, 60) + "..." || "Cuộc trò chuyện mới";
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month} ${hours}:${minutes}`;
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                <motion.button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium shadow-lg transition-all bg-gradient-to-r from-carrot-500 to-carrot-600 text-white shadow-carrot-500/30 hover:shadow-xl hover:shadow-carrot-500/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5" />
                    <span>New Chat</span>
                </motion.button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence>
                    {sessions.map((session) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="relative group"
                        >
                            <button
                                onClick={() => onSelectSession(session.id)}
                                className={`w-full text-left p-3 rounded-lg transition-all ${session.id === currentSessionId
                                    ? "bg-carrot-100 dark:bg-carrot-900/30 border border-carrot-300 dark:border-carrot-700"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                                    }`}
                            >
                                {editingId === session.id ? (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={() => handleSaveEdit(session.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSaveEdit(session.id);
                                            if (e.key === "Escape") setEditingId(null);
                                        }}
                                        className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-carrot-400 dark:border-carrot-600 rounded text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-carrot-500"
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <MessageSquare className="w-4 h-4 text-carrot-500 flex-shrink-0" />
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                    {session.title}
                                                </h4>
                                            </div>

                                            {/* Menu Button */}
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuOpenId(menuOpenId === session.id ? null : session.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {menuOpenId === session.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10"
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStartEdit(session);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                                <span>Đổi tên</span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(session.id);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Xóa</span>
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                                            {getSessionPreview(session)}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                {formatDate(session.updatedAt)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                {session.messages.length} tin nhắn
                                            </span>
                                        </div>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {sessions.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chưa có cuộc trò chuyện nào
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Nhấn "New Chat" để bắt đầu
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {sessions.length} cuộc trò chuyện
                </div>
            </div>
        </div>
    );
}

