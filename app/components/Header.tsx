"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    const pathname = usePathname();
    const isHelpPage = pathname === "/help";

    return (
        <header className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="text-3xl animate-pulse-slow">🥕</div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-carrot-500 to-carrot-600 bg-clip-text text-transparent">
                            Carrot Chat
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Powered by Carrot AI
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    {!isHelpPage && (
                        <Link href="/help">
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-carrot-100 dark:bg-carrot-900/30 text-carrot-700 dark:text-carrot-300 rounded-lg hover:bg-carrot-200 dark:hover:bg-carrot-800/50 transition-colors text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Hướng dẫn</span>
                            </motion.button>
                        </Link>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

