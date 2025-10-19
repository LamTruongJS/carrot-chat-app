"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MessageSquare,
    Sparkles,
    Download,
    RefreshCw,
    ThumbsUp,
    StopCircle,
    Keyboard,
    Moon,
    Copy
} from "lucide-react";

export default function HelpPage() {
    const features = [
        {
            icon: MessageSquare,
            title: "Chat với AI",
            description: "Gõ câu hỏi vào ô input và nhấn Enter để chat với AI Assistant",
            color: "from-blue-400 to-blue-600"
        },
        {
            icon: Sparkles,
            title: "Suggested Prompts",
            description: "Click vào các gợi ý câu hỏi ở trang chủ để bắt đầu nhanh",
            color: "from-carrot-400 to-carrot-600"
        },
        {
            icon: RefreshCw,
            title: "Regenerate Response",
            description: "Click nút Regenerate bên cạnh câu trả lời để AI tạo lại",
            color: "from-green-400 to-green-600"
        },
        {
            icon: ThumbsUp,
            title: "Reactions",
            description: "Click 👍 hoặc 👎 để đánh giá chất lượng câu trả lời",
            color: "from-yellow-400 to-yellow-600"
        },
        {
            icon: Download,
            title: "Export Chat",
            description: "Xuất lịch sử chat ra file TXT hoặc JSON để lưu trữ",
            color: "from-purple-400 to-purple-600"
        },
        {
            icon: StopCircle,
            title: "Stop Generation",
            description: "Dừng AI giữa chừng khi đang trả lời bằng nút Stop",
            color: "from-red-400 to-red-600"
        },
        {
            icon: Moon,
            title: "Dark/Light Mode",
            description: "Chuyển đổi giao diện sáng/tối bằng nút ở góc phải header",
            color: "from-indigo-400 to-indigo-600"
        },
        {
            icon: Copy,
            title: "Copy Message",
            description: "Click nút Copy để sao chép nội dung tin nhắn vào clipboard",
            color: "from-pink-400 to-pink-600"
        }
    ];

    const shortcuts = [
        { key: "Enter", action: "Gửi tin nhắn" },
        { key: "Shift + Enter", action: "Xuống dòng" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-carrot-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/">
                    <motion.button
                        className="flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-carrot-600 dark:hover:text-carrot-400 transition-colors"
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay về Chat</span>
                    </motion.button>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-carrot-400 to-carrot-600 text-white mb-6 shadow-xl">
                        <MessageSquare className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Hướng dẫn sử dụng
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Carrot Chat - AI Assistant
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        🎯 Tính năng chính
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Keyboard className="w-6 h-6 text-carrot-500" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            ⌨️ Phím tắt
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {shortcuts.map((shortcut, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <kbd className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono font-medium">
                                    {shortcut.key}
                                </kbd>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {shortcut.action}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tips Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-carrot-50 to-orange-50 dark:from-carrot-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-carrot-200 dark:border-carrot-800"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        💡 Mẹo sử dụng
                    </h2>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-carrot-500 mt-1">•</span>
                            <span>Sử dụng <strong>Suggested Prompts</strong> để bắt đầu nhanh khi chưa biết hỏi gì</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-carrot-500 mt-1">•</span>
                            <span>Click <strong>Stop Generation</strong> nếu câu trả lời quá dài hoặc không liên quan</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-carrot-500 mt-1">•</span>
                            <span>Dùng <strong>Regenerate</strong> nếu câu trả lời không satisfying, AI sẽ trả lời lại</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-carrot-500 mt-1">•</span>
                            <span><strong>Export chat</strong> để lưu lại những cuộc hội thoại quan trọng</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-carrot-500 mt-1">•</span>
                            <span>Character counter hiển thị số ký tự, chuyển <span className="text-yellow-600">vàng</span> khi &gt; 3000 và <span className="text-red-600">đỏ</span> khi &gt; 5000</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-carrot-500 mt-1">•</span>
                            <span>Lịch sử chat được <strong>tự động lưu</strong> vào trình duyệt của bạn</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Created by <span className="font-medium text-carrot-600 dark:text-carrot-400">Lê Lâm Trường</span>
                    </p>
                    <Link href="/">
                        <motion.button
                            className="px-6 py-3 bg-gradient-to-r from-carrot-500 to-carrot-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Bắt đầu Chat
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

