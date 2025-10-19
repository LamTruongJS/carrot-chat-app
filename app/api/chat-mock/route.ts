import { NextRequest, NextResponse } from "next/server";

// MOCK API - Dùng để test UI khi không có API key
// Để dùng: Đổi fetch URL từ "/api/chat" thành "/api/chat-mock"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;

        const lastMessage = messages[messages.length - 1];

        // Simulate streaming response
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                // Mock response based on user input
                const mockResponses = [
                    "Xin chào! Tôi là Carrot AI, một assistant thông minh được tạo ra để giúp đỡ bạn. 🥕",
                    "Đây là mock API để test UI. Bạn có thể thấy tất cả các tính năng hoạt động: markdown, code highlighting, v.v.",
                    "**Markdown support**: Bạn có thể dùng *italic*, **bold**, và [links](https://example.com).\n\n```javascript\nconst greeting = 'Hello World';\nconsole.log(greeting);\n```\n\nCode blocks cũng hoạt động tốt!",
                    "API này chỉ để demo. Khi bạn nạp credits vào Anthropic account, hãy đổi lại URL thành `/api/chat` nhé! 🚀"
                ];

                const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

                // Stream character by character
                for (const char of response) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ text: char })}\n\n`)
                    );
                    // Simulate typing delay
                    await new Promise((resolve) => setTimeout(resolve, 20));
                }

                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("Mock Chat API error:", error);
        return NextResponse.json(
            { error: "An error occurred" },
            { status: 500 }
        );
    }
}

