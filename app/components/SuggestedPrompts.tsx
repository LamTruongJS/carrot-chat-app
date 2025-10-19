"use client";

import { motion } from "framer-motion";
import { Sparkles, Code, BookOpen, Lightbulb, Palette, MessageCircle } from "lucide-react";

interface SuggestedPromptsProps {
    onSelect: (prompt: string) => void;
    disabled?: boolean;
}

const prompts = [
    {
        icon: Lightbulb,
        text: "Giải thích cách hoạt động của AI",
        prompt: "Hãy giải thích cách hoạt động của trí tuệ nhân tạo một cách đơn giản và dễ hiểu",
        color: "from-yellow-400 to-orange-500"
    },
    {
        icon: Code,
        text: "Viết code Python",
        prompt: "Hãy viết một đoạn code Python để xử lý và phân tích dữ liệu từ file CSV",
        color: "from-blue-400 to-blue-600"
    },
    {
        icon: BookOpen,
        text: "Tóm tắt kiến thức",
        prompt: "Hãy tóm tắt kiến thức về React hooks và cách sử dụng chúng hiệu quả",
        color: "from-green-400 to-emerald-600"
    },
    {
        icon: Palette,
        text: "Thiết kế UI/UX",
        prompt: "Gợi ý cho tôi các nguyên tắc thiết kế UI/UX hiện đại và xu hướng 2024",
        color: "from-pink-400 to-rose-600"
    },
    {
        icon: MessageCircle,
        text: "Viết nội dung marketing",
        prompt: "Hãy viết một đoạn mô tả sản phẩm hấp dẫn cho một ứng dụng chat AI",
        color: "from-purple-400 to-indigo-600"
    },
    {
        icon: Sparkles,
        text: "Ý tưởng sáng tạo",
        prompt: "Gợi ý cho tôi 5 ý tưởng sáng tạo để cải thiện trải nghiệm người dùng cho website",
        color: "from-carrot-400 to-carrot-600"
    }
];

export default function SuggestedPrompts({ onSelect, disabled = false }: SuggestedPromptsProps) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-5"
            >
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    💡 Gợi ý câu hỏi
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click vào bất kỳ gợi ý nào để bắt đầu
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {prompts.map((item, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => !disabled && onSelect(item.prompt)}
                        disabled={disabled}
                        className={`group relative p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all shadow-sm text-left ${disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-carrot-400 dark:hover:border-carrot-500 hover:shadow-md cursor-pointer"
                            }`}
                        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!disabled ? { scale: 0.98 } : {}}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm`}>
                                <item.icon className="w-[18px] h-[18px]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 group-hover:text-carrot-600 dark:group-hover:text-carrot-400 transition-colors leading-tight">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

