import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Carrot Chat - Powered by Carrot AI",
    description: "Your intelligent Carrot AI chat assistant",
    keywords: ["AI", "Chat", "Carrot AI", "Assistant"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <div className="relative h-screen flex flex-col overflow-hidden">
                    {/* Header */}
                    <Header />

                    {/* Main Content */}
                    <main className="flex-1 overflow-hidden">{children}</main>
                </div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "var(--toast-bg)",
                            color: "var(--toast-color)",
                            border: "1px solid var(--toast-border)",
                        },
                    }}
                />
            </body>
        </html>
    );
}

