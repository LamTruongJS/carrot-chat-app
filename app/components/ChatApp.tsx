"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatSession, Message } from "@/types/chat";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import { toast } from "sonner";

export default function ChatApp() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>("");
    const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar hidden
    const isCreatingSession = useRef(false); // Track if we're creating a session

    // Load sessions from localStorage
    useEffect(() => {
        const savedSessions = localStorage.getItem("carrot-chat-sessions");
        const savedCurrentId = localStorage.getItem("carrot-current-session-id");

        if (savedSessions) {
            const loadedSessions: ChatSession[] = JSON.parse(savedSessions);
            setSessions(loadedSessions);

            // If there are existing sessions, show sidebar and select one
            if (loadedSessions.length > 0) {
                setSidebarOpen(true);
                if (savedCurrentId && loadedSessions.find((s) => s.id === savedCurrentId)) {
                    setCurrentSessionId(savedCurrentId);
                } else {
                    setCurrentSessionId(loadedSessions[0].id);
                }
            }
        }
    }, []);

    // Save sessions to localStorage
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem("carrot-chat-sessions", JSON.stringify(sessions));
        } else {
            localStorage.removeItem("carrot-chat-sessions");
        }
    }, [sessions]);

    // Save current session ID
    useEffect(() => {
        if (currentSessionId) {
            localStorage.setItem("carrot-current-session-id", currentSessionId);
        } else {
            localStorage.removeItem("carrot-current-session-id");
        }
    }, [currentSessionId]);

    const generateSessionTitle = (messages: Message[]): string => {
        const firstUserMessage = messages.find((msg) => msg.role === "user");
        if (firstUserMessage) {
            const content = firstUserMessage.content;
            return content.length > 30 ? content.slice(0, 30) + "..." : content;
        }
        return `Chat ${new Date().toLocaleDateString("vi-VN")}`;
    };

    const createNewSession = () => {
        // Check if there's already an empty session
        const emptySession = sessions.find(session => session.messages.length === 0);

        if (emptySession) {
            // Switch to the existing empty session instead of creating new one
            setCurrentSessionId(emptySession.id);
            setSidebarOpen(true);
            toast.info("Đã chuyển đến cuộc trò chuyện trống", {
                description: "Bắt đầu chat để tạo cuộc trò chuyện mới nhé! 🥕"
            });
            return;
        }

        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: "Cuộc trò chuyện mới",
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setSidebarOpen(true); // Show sidebar when creating new session
        toast.success("Đã tạo cuộc trò chuyện mới");
    };

    const updateCurrentSession = useCallback((messages: Message[]) => {
        // If no current session and user sends first message, create new session
        if (!currentSessionId && messages.length > 0) {
            // Prevent duplicate session creation
            if (isCreatingSession.current) {
                return;
            }

            isCreatingSession.current = true;

            const newSession: ChatSession = {
                id: Date.now().toString(),
                title: generateSessionTitle(messages),
                messages,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            setSessions((prev) => [newSession, ...prev]);
            setCurrentSessionId(newSession.id);
            setSidebarOpen(true); // Show sidebar when first message is sent

            // Reset flag after a short delay
            setTimeout(() => {
                isCreatingSession.current = false;
            }, 100);
            return;
        }

        // Update existing session
        setSessions((prev) =>
            prev.map((session) => {
                if (session.id === currentSessionId) {
                    // Auto-generate title from first message if still default
                    const title =
                        session.title === "Cuộc trò chuyện mới" && messages.length > 0
                            ? generateSessionTitle(messages)
                            : session.title;

                    return {
                        ...session,
                        messages,
                        title,
                        updatedAt: Date.now(),
                    };
                }
                return session;
            })
        );
    }, [currentSessionId]);

    const handleSelectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        isCreatingSession.current = false; // Reset flag when switching sessions
    };

    const handleDeleteSession = (sessionId: string) => {
        setSessions((prev) => {
            const filtered = prev.filter((s) => s.id !== sessionId);

            // If deleting current session
            if (sessionId === currentSessionId) {
                if (filtered.length > 0) {
                    // Switch to first remaining session
                    setCurrentSessionId(filtered[0].id);
                } else {
                    // No sessions left - return to welcome screen
                    setCurrentSessionId("");
                    setSidebarOpen(false);
                    localStorage.removeItem("carrot-chat-sessions");
                    localStorage.removeItem("carrot-current-session-id");
                }
            }

            return filtered;
        });

        toast.success("Đã xóa cuộc trò chuyện");
    };

    const handleRenameSession = (sessionId: string, newTitle: string) => {
        setSessions((prev) =>
            prev.map((session) =>
                session.id === sessionId
                    ? { ...session, title: newTitle, updatedAt: Date.now() }
                    : session
            )
        );
    };

    const handleClearCurrentChat = () => {
        if (!currentSessionId) return;

        // Delete current session
        handleDeleteSession(currentSessionId);
    };

    const currentSession = sessions.find((s) => s.id === currentSessionId);

    return (
        <div className="h-full flex">
            {/* Sidebar */}
            <div
                className={`transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0"
                    } flex-shrink-0 overflow-hidden`}
            >
                <Sidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    onSelectSession={handleSelectSession}
                    onNewChat={createNewSession}
                    onDeleteSession={handleDeleteSession}
                    onRenameSession={handleRenameSession}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 overflow-hidden">
                <ChatContainer
                    key={currentSession?.id || "new"}
                    initialMessages={currentSession?.messages || []}
                    onMessagesChange={updateCurrentSession}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onClearChat={handleClearCurrentChat}
                    onNewChat={createNewSession}
                />
            </div>
        </div>
    );
}

