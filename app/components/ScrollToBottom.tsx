"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface ScrollToBottomProps {
    visible: boolean;
    onClick: () => void;
}

export default function ScrollToBottom({ visible, onClick }: ScrollToBottomProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={onClick}
                    className="fixed bottom-24 right-8 z-10 p-3 rounded-full bg-gradient-to-r from-carrot-500 to-carrot-600 text-white shadow-lg hover:shadow-xl transition-all hover:from-carrot-600 hover:to-carrot-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Scroll to bottom"
                >
                    <ArrowDown className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

